import express from "express";
import {avatarUpload} from "../middleware";
import {protectorMiddleware, pulicOnlyMiddleware} from "../middleware";
import { getEdit, postEdit,logout,startGithubLogin,finishGithubLogin, see,startKakaoLogin, finishKakaoLogin, getChangePassword, postChangePassword} from "../controllers/userController";
const userRouter = express.Router();


userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start",pulicOnlyMiddleware,  startGithubLogin);
userRouter.get("/github/finish", pulicOnlyMiddleware, finishGithubLogin);
userRouter.get("/kakao/start", pulicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", pulicOnlyMiddleware,  finishKakaoLogin);
userRouter.get("/:id", see);

export default userRouter;