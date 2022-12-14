import express from "express";
import {registerView, createComment,removeComment, editComment} from "../controllers/videoController";


const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment",createComment);
apiRouter.delete("/videos/:commentId([0-9a-f]{24})/delete",removeComment);
apiRouter.post("/videos/:commentId([0-9a-f]{24})/edit",editComment);

export default apiRouter;