import bcrypt from "bcrypt";
import { application } from "express";
import User from "../models/User";
import fetch from "node-fetch";

export const getJoin = (req,res) => res.render("join", {pageTitle: "Join"});

export const postJoin = async (req, res) => {
    const { name, username, email, password,password2, location } = req.body;
    const pageTitle = "Join";
    if(password !== password2){
      return res.status(400).render("join", {pageTitle, errorMessage: "please check the password again."});
    }
    const exists = await User.exists({$or: [{username}, {email}]});
    if(exists){
      return res.status(400).render("join", { pageTitle, errorMessage : "this username/email is already taken."});
    }
   try{
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
   }catch(error) {
      return res.status(400).render("join", {pageTitle, errorMessge: error._message})
   }
  };

export const getLogin = (req,res) => res.render("login")

export const PostLogin = async(req,res) => {
  const {username, password} = req.body;
  const pageTitle = "Login"
  const user = await User.findOne({username});
  if(!user) {
      return res.status(400).render("login", {pageTitle, errorMessage : `An Account with this ${username} does not exists.`})
  }
  const ok = await bcrypt.compare(password, user.password);
  if(!ok){
    return res.status(400).render("login", {pageTitle, errorMessage : `wrong password`})
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
}

export const startGithubLogin = (req,res) => {
  const baseUrl ="https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl)
};

export const finishGithubLogin = async (req,res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await(
    await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
  ).json();
  if("access_token" in tokenRequest){
      const {access_token} = tokenRequest;
      const apiUrl = "https://api.github.com"
      const userData = await(
        await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        }
      })
      ).json();
      const emailData = await(
        await fetch(`${apiUrl}/user/emails`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })).json();
        const emailObj = emailData.find(
          (email) => email.primary === true && email.vertified === true
        );
        if(!emailObj){
          return res.redirect("/login");
        }
        const existingUser = await User.findOne({email: emailObj.email});
        if(existingUser){
          req.session.loggedIn = true;
          req.session.user = existingUser;
          return res.redirect("/");
        }
        else{
          const user = await User.create({
            name:userData.name,
            username:userData,login,
            email:emailObj.email,
            password:"",
            socialOnly: true,
            location:userData.location,
          });
          req.session.loggedIn = true;
          req.session.user = user;
          return res.redirect("/");
        }
  }else {
    return res.redirect("/login");
  }
};
export const edit = (req,res) => res.send("edit user");
export const remove = (req,res) => res.send("delete user");
export const logout = (req,res) => res.send("logout here!");
export const see = (req,res) => res.send("see User");


 