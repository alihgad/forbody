import mongoose from "mongoose";
import dotenv from 'dotenv'
import path from 'path'
dotenv.config()
const connectionDB = mongoose.connect(process.env.URI)
    .then(() => {
        console.log("3ash")
    }).catch(err => console.error(err));

export default connectionDB