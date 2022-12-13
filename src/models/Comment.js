import mongoose  from "mongoose";

const commnetSchema = new mongoose.Schema({
    text: {type:String, required:true},
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref: "User"},
    video: {type: mongoose.Schema.Types.ObjectId, required:true, ref: "video"},
    createdAt: {type: Date, required: true, default: Date.now},
})

const  Comment = mongoose.model("Comment", commnetSchema);

export default Comment;