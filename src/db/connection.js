import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const connectionDB = mongoose.connect(process.env.URI)
    .then(() => {
        console.log("3ash")
    }).catch(err => console.error(err));

export default connectionDB