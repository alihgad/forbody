import mongoose, { Types } from "mongoose";

let productSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15,
        lowercase:true,
        trim:true,
        unique: true
    }
    ,
    slug:{
        type: String,
        unique: true,
        minLength: 3,
        maxLength: 15,
        trim:true,
    }
    ,
    descreption:{
        type: String,
        minLength: 3,
        maxLength: 300,
        required: true,
    }
   
    ,
    image:{
        secure_url:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        }
    }
    ,
    customId : {
        type: String,
        required: true,
        unique: true    
    }
    ,
    price:{
        type: Number,
        required: true,
        min: 1
    }
    ,
    isDiscounted:{
        type : Boolean,
        default: false
    }
    ,
    discount:{
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
    ,
    subPrice:{
        type: Number,
        required: true,
        min: 1,
        default:0
    },
    stock:{
        type : Number,
        min:0,
        default:0
    }
  
})

export const productModel= mongoose.models.product || mongoose.model('product', productSchema)  
