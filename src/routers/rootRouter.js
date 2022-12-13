import express, { application } from "express";
import {pulicOnlyMiddleware} from "../middleware";
import {getJoin, postJoin, getLogin, PostLogin} from "../controllers/userController";
import {home, search} from "../controllers/videoController";

const rootRouter= express.Router();


rootRouter.get("/", home);
rootRouter.route("/join").all(pulicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(pulicOnlyMiddleware).get(getLogin).post(PostLogin);
rootRouter.get("/search", search);



export default rootRouter;

