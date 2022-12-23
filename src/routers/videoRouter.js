import express from "express";
import {protectorMiddleware} from "../middleware";
import {videoUpload} from "../middleware";
import {watch, getEdit, getUpload , postUpload, postEdit,deleteVideo} from "../controllers/videoController";


const videoRouter = express.Router();


videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);



export default videoRouter;
