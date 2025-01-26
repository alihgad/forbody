import mongoose from "mongoose";

const connectionDB = mongoose.connect('mongodb+srv://alihgad2:alimongo@bookshub.4uutypb.mongodb.net/forbody')
    .then(() => {
        console.log("3ash")
    }).catch(err => console.error(err));

export default connectionDB