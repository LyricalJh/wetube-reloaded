import bcrypt from "bcrypt";
import { application } from "express";
import Video from "../models/Video";
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
  const user = await User.findOne({username, socialOnly: false});
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
  //파마미터 정보 값 
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  //finalUrl 우리가 깃허브에 설정해놓은 url 이고 이 url로 유저를 리다이렉트로 보내준다.
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
      const emailData = await (
        await fetch(`${apiUrl}/user/emails`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();
        const emailObj = emailData.find(
          (email) => email.primary === true && email.verified === true
        );
        
        if(!emailObj){
          return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});
        if(!user){
            user = await User.create({
            avatarUrl: userData.avatar_url,
            name:userData.name,
            username:userData.login,
            email:emailObj.email,
            password:"",
            socialOnly: true,
            location:userData.location,
          });
        }
          req.session.loggedIn = true;
          req.session.user = user;
          return res.redirect("/");
        
  }else {
    return res.redirect("/login");
  }
};
export const logout = (req,res) => {
  req.session.destroy();
  req.flash("info", "성공적으로 로그아웃 되었습니다.");
  return res.redirect("/");
}


export const startKakaoLogin = (req,res) => {
  const finalUrl = "http://localhost:4000/users/kakao/finish";
  const appKey = process.env.KA_CLIENT;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${appKey}&redirect_uri=${finalUrl}&response_type=code`;
  res.redirect(KAKAO_AUTH_URL);
}

export const finishKakaoLogin = async (req,res) => {
      const baseUrl = "https://kauth.kakao.com/oauth/token";
      const reUrl = "http://localhost:4000/users/kakao/finish";
      const config = {
        grant_type: "authorization_code",
        client_id: process.env.KA_CLIENT,
        redirect_uri: reUrl,
        code: req.query.code,
      }

      console.log(config);
      const params = new URLSearchParams(config).toString();
      const fianlUrl = `${baseUrl}?${params}`;
      const tokenRequest = await (await fetch(fianlUrl, {
        method: "POST",
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
      ).json();
      if('access_token' in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://kapi.kakao.com/v2/user/me";
        const userData = await (await fetch(`${apiUrl}`, {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        })).json();
        console.log(userData);
        
        const email = userData.kakao_account.email;
        console.log(email);

        if(!email) {
          return res.redirect("/login");
        }
        let existingUser = await User.findOne({email: userData.email});
        if(existingUser){
          req.session.loggedIn = true;
          req.session.user = existingUser;
          return res.redirect("/");
        }
        else{
            const user = await User.create({
            name: userData.properties.nickname,
            username: userData.properties.nickname,
            email: userData.kakao_account.email,
            password: "",
            socialOnly: true,
            location: "",
          });
          req.session.loggedIn = true;
          req.session.user = user;
          return res.redirect("/");
        }
      }else{
        return res.redirect("/login");
      }
};

export const getEdit = (req,res) => {
    return res.render("edit-profile", {pageTitle:"Edit Profile"});
}
export const postEdit =async (req,res) => {
  const pageTitle = "Edit Profile"
  const {
    session: {
      user: {_id, avatarUrl},
    },
    body :{name, email, username, location},
    file,
  } = req;
  
  console.log(file);
    const updatedUsre =  await User.findByIdAndUpdate(_id, {
      avatarUrl: file ? file.location : avatarUrl, 
      name,
      email,
      username,
      location,
    },
      {new : true}
      );
    req.session.user = updatedUsre;
    return res.redirect("/users/edit");
  
  }


  export const  getChangePassword = (req,res) => {
    if(req.session.user.socialOnly === true){
      req.flash("error", "비밀번호를 변경할 수 없습니다.");
      return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle: "change-Password"});
  }

  export const postChangePassword = async (req,res) => {
    const {
      session: {
        user: {_id},
      },
      body :{oldPassword, newPassword, newPasswordConfirmation},
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword,user.password);
    
    if(!ok){
      return res.status(400).render("users/change-password", {pageTitle: "change-password", errorMessage: "current password is incorret."})
    }
    if(newPassword !== newPasswordConfirmation){
      return res.status(400).render("users/change-password", {pageTitle: "change-password", errorMessage: "please check your password."})
    }
    user.password = newPassword;
    await user.save();
    req.flash("info", "비밀번호가 변경되었습니다.");
    return res.redirect("/");
  }

export const see = async (req,res) => {
  const {id} = req.params;
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if(!user){
    res.status(404).render("404",{pageTitle: "User not found"});
  }
  
  return res.render("users/profile", {pageTitle:`${user.name} 님 profile` ,user});
};