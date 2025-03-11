import { Router } from "express";
import { createProudctSchema, updateProudctSchema } from "./productSchemas.js";
import { createProduct, deleteProudct, getOneProudct, getProudcts, updateProduct } from "./product.controler.js";
import GValidator from "../../services/GValidator.js";
import auth from "../../services/auth.js";
import { multerHost } from "../../services/multer.js";




productRouter.post('/',auth(["admin"]),multerHost().fields([{name:'image' , maxCount:1  },{ name:"images",maxCount: 4}]),GValidator(createProudctSchema),createProduct)
productRouter.delete('/:ProductID',auth(["admin"]),deleteProudct)
productRouter.put('/:ProductID',auth(["admin"]),multerHost().fields([{name:'image' , maxCount:1  },{ name:"images",maxCount: 4}]),GValidator(updateProudctSchema),updateProduct)
productRouter.get('/',getProudcts)
productRouter.get('/:ProductID',getOneProudct)


export default productRouter