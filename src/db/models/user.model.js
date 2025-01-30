import mongoose from "mongoose";

let userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15,
        trim:true
    }
    ,
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    }
    ,
    password:{
        type: String,
        trim:true
    }
    ,
    age:{
        type: Number,
        min: 18,
    }
    ,
    phones: [String],
    adress: [String],
    confirmed:{
        type: Boolean,
        default: false
    }
    ,
    role:{
        type: String,
        enum: ["user", "admin"],
        required: true,
        default: "user"
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    code:{
        type: String,
        default:""
    },
    passwordChangedAt:{
        type: Number,
        default: null
    },
    provider:{
        type: String,
        enum: ["email", "google"],
        default: "email"
    }

})

export const userModel= mongoose.model('user', userSchema);