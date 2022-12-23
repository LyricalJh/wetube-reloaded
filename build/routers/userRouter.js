"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _middleware = require("../middleware");
var _userController = require("../controllers/userController");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var userRouter = _express["default"].Router();
userRouter.get("/logout", _middleware.protectorMiddleware, _userController.logout);
userRouter.route("/edit").all(_middleware.protectorMiddleware).get(_userController.getEdit).post(_middleware.avatarUpload.single("avatar"), _userController.postEdit);
userRouter.route("/change-password").all(_middleware.protectorMiddleware).get(_userController.getChangePassword).post(_userController.postChangePassword);
userRouter.get("/github/start", _middleware.pulicOnlyMiddleware, _userController.startGithubLogin);
userRouter.get("/github/finish", _middleware.pulicOnlyMiddleware, _userController.finishGithubLogin);
userRouter.get("/kakao/start", _middleware.pulicOnlyMiddleware, _userController.startKakaoLogin);
userRouter.get("/kakao/finish", _middleware.pulicOnlyMiddleware, _userController.finishKakaoLogin);
userRouter.get("/:id", _userController.see);
var _default = userRouter;
exports["default"] = _default;