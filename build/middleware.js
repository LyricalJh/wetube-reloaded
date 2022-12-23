"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoUpload = exports.pulicOnlyMiddleware = exports.protectorMiddleware = exports.localMiddleware = exports.avatarUpload = void 0;
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var localMiddleware = function localMiddleware(req, res, next) {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};
exports.localMiddleware = localMiddleware;
var protectorMiddleware = function protectorMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "로그인 이후 서비스 사용 가능합니다.");
    return res.redirect("/login");
  }
};
exports.protectorMiddleware = protectorMiddleware;
var pulicOnlyMiddleware = function pulicOnlyMiddleware(req, res, next) {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not allow");
    return res.redirect("/");
  }
};
exports.pulicOnlyMiddleware = pulicOnlyMiddleware;
var avatarUpload = (0, _multer["default"])({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000
  }
});
exports.avatarUpload = avatarUpload;
var videoUpload = (0, _multer["default"])({
  dest: "uploads/videos",
  limits: {
    fileSize: 1000000000000
  }
});
exports.videoUpload = videoUpload;