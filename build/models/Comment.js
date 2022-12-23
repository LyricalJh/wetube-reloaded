"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var commnetSchema = new _mongoose["default"].Schema({
  text: {
    type: String,
    required: true
  },
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  video: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "video"
  },
  createdAt: {
    type: Date,
    required: true,
    "default": Date.now
  }
});
var Comment = _mongoose["default"].model("Comment", commnetSchema);
var _default = Comment;
exports["default"] = _default;