import moment from "moment";
import { format } from "morgan";

const formatTimetitme = document.getElementById("video__timeFormat");
let formatTime = document.querySelectorAll("#formatTime");

const formatedTimeTitle = moment(formatTimetitme.innerText).format("MM월 DD일 제작된 비디오");
formatTimetitme.innerText = formatedTimeTitle;

const makeformat =() => {
    return moment(formatTime.innerText).format("MM월 DD일 작성");
} 



if(formatTime){
    formatTime.forEach(element => element.innerText = moment(element.innerText).format("MM월 DD일 작성"));
    
}