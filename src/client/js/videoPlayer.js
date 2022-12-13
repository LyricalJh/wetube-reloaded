const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumRange = document.getElementById("volum");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreen = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

console.log(videoContainer.dataset);

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumnValue = 0.5;
video.volume = volumnValue;


const handlePlay = (e)=> {
    if(video.paused) {
        video.play();
    }  else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    }else {
        video.muted = true;
        
    }

    muteBtn.innerText = video.muted ? "Unmuted" : "Mute" ;
    volumRange.value = video.muted ? 0  : volumnValue;
};

const handlePause = (e) => {
    playBtn.innerText = "Play";
    
}
const handleVolumChange = (event) => {
    const {
        target: {value},
        } = event;
        if(video.muted){
            video.muted = false;
            muteBtn.innerText = "Mute";
        }
        volumnValue = value;
        video.volume = value;
    
}

const handlePlayClick = (e) => playBtn.innerText = "Pause";

const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substring(11,19);
}

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}

const handleTimeUpdate = () => {
    currenTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}


const handleTimelineChange = (event) => {
    const {
        target: {value}
    }= event;
    video.currentTime = value;
}

const handleFullScreen = () => {
    const fullScreenBtn = document.fullscreenElement;
    if(fullScreenBtn){
        document.exitFullscreen();
        fullScreen.innerText = "Enter Full Screen";
    }else {
        videoContainer.requestFullscreen();
        fullScreen.innerText = "Exit Full Screen";
    }
   
}

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleEnded = () => {
    const {id} = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
      method: "POST",
    });
  };

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click",handleMute);
volumRange.addEventListener("input", handleVolumChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
video.addEventListener("mousemove",handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreen.addEventListener("click", handleFullScreen);
