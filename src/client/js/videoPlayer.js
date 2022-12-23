const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


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
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
    
const handleMute = (e) => {
    if(video.muted){
        video.muted = false;
    }else {
        video.muted = true;
    }

    muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
    volumRange.value = video.muted ? 0  : volumnValue;
};

const handlePause = (e) => {
    playBtn.innerText = "Play";
    
}
const handleVolumeChange = (event) => {
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
    return new Date(seconds * 1000).toISOString().substring(14,5);
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
    const fullscreen = document.fullscreenElement;
    console.log(fullscreen);
    if(fullscreen){
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    }else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
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

// const handleEnded = () => {
//     const {id} = videoContainer.dataset;
//     fetch(`/api/videos/${id}/view`, {
//       method: "POST",
//     }); 
//   };

const handleClickPlay = (event)=> {
    if(video.paused){
        video.play()
    }else {
        video.pause();
    }
}

const handleSpacebar = (event) => {
    const spaceBar = event.code;
    if(spaceBar === "Space" && video.paused){
        video.play();
    }else{
        video.pause();
    }
}


window.addEventListener("keydown", handleSpacebar);
playBtn.addEventListener("click", handlePlay);
video.addEventListener("click", handleClickPlay);
muteBtn.addEventListener("click",handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
// video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove",handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
