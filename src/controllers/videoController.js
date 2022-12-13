import { query } from "express";
import Video from "../models/Video";
import User from "../models/User";



export const home = async(req,res) => {
   const videos = await Video.find({}).sort({createdAt: "desc"}).populate("owner");
   return res.render("home", {pageTitle: "Home", videos});
}
export const watch = async (req,res) => {

    const {id} = req.params;
    const video = await Video.findById(id).populate("owner");
    console.log(video);
    if(video === null){
        return res.status(404).render("404", {pageTitle: "video not found"});
    }
    return res.render("watch", {pageTitle: video.title, video}); 
    
}
export const getEdit = async (req,res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "video not fount"});
    }
    if(String(video.owner) !== String(_id) ){
        req.flash("error", "Not allow");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Edit ${video.title}`, video});
}
export const postEdit = async(req,res) => {
    const {id} = req.params;
    const {
        user: {_id}
    } = req.session;
    const {title,description,hashtags } = req.body;
    const video = await Video.exists({_id:id});
    if(video === null){
        return res.render("404", {pageTitle: "video not fount"});
    }
    if(String(video.owner) !== String(_id) ){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("success", "업데이트 완료 되었습니다.")
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req,res) => {
    return res.render("upload", {pageTitle: "Upload"});
}

export const postUpload = async(req,res) => {
    const {
        user: {_id}
    } = req.session;
    const {video, thumb} = req.files;
    const { title,description,hashtags } = req.body;
    try{
    const newVideo = await Video.create({
        title,
        description,
        fileUrl: video[0].path,
        thumbUrl: thumb[0].path,
        owner:_id,
        hashtags:Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    
    user.save();
    return res.redirect("/");
    }catch(error) {
        return res.status(400).render("upload", { pageTitle: "Upload Video", errorMessage: error._message,});
    }
}
export const deleteVideo = async (req,res) => {
    const {id} = req.params;
    const {
        user: {_id}
    } = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "video not found"});
    }
    if(String(video.owner !== String(_id))){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");


}

export const search = async (req,res) => {
    const {keyword} = req.query;   
    let videos = [];
    if(keyword) {
         videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", {pageTitle: "Search", videos});
}

export const registerView = async (req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = (req,res) => {
    const {
        session: {user},
        body: {text},
        params: {id},
    } = req;
    console.log("plz work",req.body.text);
    return res.end();
};