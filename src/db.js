import mongoose from "mongoose";


mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;


const handleOpen = () => console.log("😍Conneted to DB")
const handleError = (error) => console.log("DB Error", error);

db.on("error",handleError) ;
db.once("open", handleOpen);