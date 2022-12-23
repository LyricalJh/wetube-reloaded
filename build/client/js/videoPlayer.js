"use strict";

var video = document.querySelector("video");
var playBtn = document.getElementById("play");
var playBtnIcon = playBtn.querySelector("i");
var muteBtn = document.getElementById("mute");
var muteBtnIcon = muteBtn.querySelector("i");
var volumeRange = document.getElementById("volume");
var currenTime = document.getElementById("currenTime");
var totalTime = document.getElementById("totalTime");
var timeline = document.getElementById("timeline");
var fullScreenBtn = document.getElementById("fullScreen");
var fullScreenIcon = fullScreenBtn.querySelector("i");
var videoContainer = document.getElementById("videoContainer");
var videoControls = document.getElementById("videoControls");
var controlsTimeout = null;
var controlsMovementTimeout = null;
var volumnValue = 0.5;
video.volume = volumnValue;
var handlePlay = function handlePlay(e) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
var handleMute = function handleMute(e) {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumRange.value = video.muted ? 0 : volumnValue;
};
var handlePause = function handlePause(e) {
  playBtn.innerText = "Play";
};
var handleVolumeChange = function handleVolumeChange(event) {
  var value = event.target.value;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumnValue = value;
  video.volume = value;
};
var handlePlayClick = function handlePlayClick(e) {
  return playBtn.innerText = "Pause";
};
var formatTime = function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substring(14, 5);
};
var handleLoadedMetaData = function handleLoadedMetaData() {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};
var handleTimeUpdate = function handleTimeUpdate() {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};
var handleTimelineChange = function handleTimelineChange(event) {
  var value = event.target.value;
  video.currentTime = value;
};
var handleFullScreen = function handleFullScreen() {
  var fullscreen = document.fullscreenElement;
  console.log(fullscreen);
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};
var hideControls = function hideControls() {
  return videoControls.classList.remove("showing");
};
var handleMouseMove = function handleMouseMove() {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
var handleMouseLeave = function handleMouseLeave() {
  controlsTimeout = setTimeout(hideControls, 3000);
};

// const handleEnded = () => {
//     const {id} = videoContainer.dataset;
//     fetch(`/api/videos/${id}/view`, {
//       method: "POST",
//     }); 
//   };

var handleClickPlay = function handleClickPlay(event) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
var handleSpacebar = function handleSpacebar(event) {
  var spaceBar = event.code;
  if (spaceBar === "Space" && video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
window.addEventListener("keydown", handleSpacebar);
playBtn.addEventListener("click", handlePlay);
video.addEventListener("click", handleClickPlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
// video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);