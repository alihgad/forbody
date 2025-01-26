import { Router } from "express";
import {clearCart, createCart, getCart, removeFromCart} from './cart.controler.js'
import { createCartSchema } from "./cartSchemas.js";
import GValidator from "../../services/GValidator.js";
import auth from "../../services/auth.js";


let cartRouter = Router()


cartRouter.post('/',auth(["admin" , "user"]),GValidator(createCartSchema),createCart)
cartRouter.put('/:productId',auth(["admin" , "user"]),removeFromCart)
cartRouter.get('/',auth(["user" , "admin"]),getCart)
cartRouter.delete('/',auth(["admin" , "user"]),clearCart)

export default cartRouter