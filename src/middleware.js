import multer from "multer";

export const localMiddleware = (req,res,next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    next();
}

export const protectorMiddleware = (req,res,next) => {
    if(req.session.loggedIn){
        return next();
    }else {
        req.flash("error", "로그인 이후 서비스 사용 가능합니다.");
        return res.redirect("/login");
    }
    
};
export const pulicOnlyMiddleware = (req,res,next) => {
    if(!req.session.loggedIn){
        return next();
    }else {
        req.flash("error", "Not allow");
        return res.redirect("/");
    }
}

export const avatarUpload = multer({dest:"uploads/avatars", limits: {
    fileSize: 3000000,
}});

export const videoUpload = multer({dest: "uploads/videos", limits: {
    fileSize: 1000000000000,
}});