import slugify from "slugify";
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from "nanoid";
import AppError from "../../services/AppError.js";
import asyncHandler from "../../services/asyncHandler.js";
import { productModel } from "../../db/models/product.model.js";


export const createProduct = asyncHandler(async (req, res, next) => {
    const { title , stock , descreption , price  , discount } = req.body
  
    let customId = nanoid(5)

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `forBody/${customId}`
    })

    req.folder = `forBody/${customId}`
    


    let product = await productModel.create({
        title,
        slug : slugify(title,{replacement:'-',lower : true}),
        stock : Number(stock) ,
        descreption ,
        price ,
        subPrice: discount? price - (discount/100*price) : price,
        isDiscounted : discount ? true : false,
        discount ,
        customId,
        image : { secure_url, public_id },
    })

    req.data = {model : productModel , id : product._id}

    return res.status(201).json({ msg: 'product created' , product })
})

export const updateProduct = asyncHandler(async (req, res, next) => {
    const { title , stock , descreption , price , discount , isDiscounted } = req.body
    const {ProductID } = req.params

   
    let product = await productModel.findOne({_id:ProductID })

    if(!product){
        next(new AppError( 'Product not found ', 404))
    }
    

    if(title){
        let titleExist = await productModel.findOne({ title: title.toLowerCase() })

        if(titleExist){
            next(new AppError( 'product title already exists', 400))
        }

        product.title = title.toLowerCase()
        product.slug = slugify(title,{replacement:'-',lower : true})
    }

    if(req?.files){
        if(req.files?.image?.[0]){
            await cloudinary.uploader.destroy(product.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
                 folder: `forBody/${product.customId}`
            })

            req.folder = `forBody/${product.customId}`
            product.image.secure_url = secure_url
            product.image.public_id = public_id
        }

        
    }


    if(stock){
        product.stock = stock
    }

    if(descreption){
        product.descreption = descreption
    }

    if(price || discount){
        product.price = price || product.price
        product.discount = discount || product.discount
        product.subPrice = product.price - (product.discount/100*product.price)
    }

    if(discount){
        
    }


    await product.save()

    return res.json({ msg: 'Product updated', product })
})


export const getProudcts = asyncHandler(async (req,res,next)=>{
   
   
    let products = await productModel.find()
    
    return res.json({ msg: 'Products fetched', products })
})

export const getOneProudct = asyncHandler(async (req,res,next)=>{
    let {ProductID} = req.params
   
    let product = await productModel.findById(ProductID)
    
    return res.json({ msg: 'Products fetched', product })
})





export const deleteProudct = asyncHandler(async (req, res, next) => {
    let {ProductID} = req.params

 
    let Product = await productModel.findOneAndDelete({_id:ProductID})
    
    if(!Product){
        next(new AppError( 'Product not found ', 404))
    }
    
    await cloudinary.api.delete_resources_by_prefix(`forBody/${Product.customId}`)
    await cloudinary.api.delete_folder(`forBody/${Product.customId}`)

    return res.json({ msg: 'Product deleted' , Product})
})
    
