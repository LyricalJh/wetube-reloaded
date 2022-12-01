import express, { application } from "express";
import {getJoin, postJoin, getLogin, PostLogin} from "../controllers/userController";
import {home, search} from "../controllers/videoController";

const rootRouter= express.Router();


rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(PostLogin);
rootRouter.get("/search", search);



export default rootRouter;

