"use strict";

var _moment = _interopRequireDefault(require("moment"));
var _morgan = require("morgan");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var formatTimetitme = document.getElementById("video__timeFormat");
var formatTime = document.querySelectorAll("#formatTime");
var formatedTimeTitle = (0, _moment["default"])(formatTimetitme.innerText).format("MM월 DD일 제작된 비디오");
formatTimetitme.innerText = formatedTimeTitle;
var makeformat = function makeformat() {
  return (0, _moment["default"])(formatTime.innerText).format("MM월 DD일 작성");
};
if (formatTime) {
  formatTime.forEach(function (element) {
    return element.innerText = (0, _moment["default"])(element.innerText).format("MM월 DD일 작성");
  });
}