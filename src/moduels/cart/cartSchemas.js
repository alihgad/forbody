import joi from 'joi'
import glopalSchema from '../../services/glopalSchema.js'

export const createCartSchema = {
    body: joi.object({
        productId : glopalSchema.id.required(),
        quantity : joi.number().min(1).required()
    }),

    headers: glopalSchema.headers.required(),

}

export const updateCartSchema = {
    body: joi.object({
        quantity : joi.number().min(1)
    }),

    headers: glopalSchema.headers.required(),
} 