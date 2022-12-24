import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    }
})
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
const S3ImageUploader = multerS3({
    s3:s3,
    bucket: 'wetube-junghan/images',
    acl: 'public-read',
});

const S3VideoUploader = multerS3({
    s3:s3,
    bucket: 'wetube-junghan/videos',
    acl: 'public-read',
})




export const avatarUpload = multer({dest:"uploads/avatars", limits: {
    fileSize: 3000000,
},
storage :S3ImageUploader,
});

export const videoUpload = multer({dest: "uploads/videos", limits: {
    fileSize: 1000000000000,
},
storage :S3VideoUploader,
});
