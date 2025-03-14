import { v2 as cloudinary } from 'cloudinary';


export default (cb)=>{
    return (req,res,next)=>{
        cb(req,res,next).catch(err=>{
            return res.status(err.statusCode || 500).json({message: err.message , stack:err.stack})
        })
    }
}


export const glopalErrorHandler = (err,req,res,next)=>{
    
    return res.status(err.statusCode || 500).json({message: err.message , stack:err.stack})
}



export const deleteFolder = async (req, res, next)=>{
    if(req.folder){
        await cloudinary.api.delete_resources_by_prefix(req.folder)
        await cloudinary.api.delete_folder(req.folder)

    }
    next()
}

export const deleteFromDB = async (req, res, next)=>{
    if(req.data){
        await req.data.model.findByIdAndDelete(req.data.id)
    }
    return
}   