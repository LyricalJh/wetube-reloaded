const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
let spanX = document.querySelectorAll("#remove");
const videoComment = document.querySelector(".video__comment");
const reply = document.querySelector(".comment__text");
const replyBtn = document.querySelector(".reply__comment");
const userImg = document.querySelector(".title__img");
const editBtn = document.querySelectorAll("#edit");
const comment = document.querySelectorAll(".comments");







const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment__box";
    const userImage = document.createElement("img");
    userImage.className = "title__img";
    userImage.src = userImg.src;
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className= "video__comment";
    const span = document.createElement("span");
    span.className = "comments";
    span.innerText= ` ${text}`;
    const spanX = document.createElement("span");
    spanX.innerText = "삭제";
    spanX.id = "remove"; 
    videoComments.prepend(commentDiv);
    commentDiv.appendChild(newComment);
    commentDiv.appendChild(userImage);
    commentDiv.prepend(userImage);
    newComment.appendChild(span);
    newComment.appendChild(spanX);
    window.location.reload();
    
    
}


const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    
    if(text === ""){
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({text}),
    });
    
    if(response.status === 201 || response.status === 200){
        textarea.value = "";
        const {newCommentId} = await response.json();
        addComment(text, newCommentId);
        spanX = document.getElementById("remove");
        spanX.addEventListener("click", removeComment);

    }
  
};






const removeComment = async (event) => {
    const li = event.target.parentElement;
    const commentId = li.dataset.id;
    const response = await fetch(`/api/videos/${commentId}/delete`, {
        method: "DELETE",
    });
    if(response.status === 200){
        li.parentElement.closest(".comment__box").remove();
    }
};



const editComment = (event) => {
    
    const commnet = event.target.parentElement.firstChild;
    commnet.contentEditable = true;
    

    event.target.removeEventListener("click", editComment);
    event.target.addEventListener("click", saveComment);
    event.target.innerText = "수정";

};

const saveComment = async(event) => {
    const commentId = event.target.parentElement.dataset.id; //get the target id
    const commnet = event.target.parentElement.firstChild;
    const text = event.target.parentElement.firstChild.innerText; 

    const response = await fetch(`/api/videos/${commentId}/edit`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text}),
    });

    if(response.status === 200){
        commnet.contentEditable = false;
        event.target.innerText = "편집";
        window.location.reload();
    
        
        
    }
    
};




const handleKeydown = (event) => {
    if(reply.value === ""){
        replyBtn.classList.remove("getblue");
    }else {
        replyBtn.classList.add("getblue");
    }   
}

if(form){
    form.addEventListener("submit", handleSubmit);
};


reply.addEventListener("keydown", handleKeydown);

if(editBtn){
    editBtn.forEach(element => element.addEventListener("click", editComment));
}


if(spanX){
    spanX.forEach(element => element.addEventListener("click",removeComment));
}
