import joi from 'joi'
import glopalSchema from '../../services/glopalSchema.js'


export const createProudctSchema = {
    body: joi.object({
        title: joi.string().required(),
        stock : joi.required(),
        descreption : joi.string().required(),
        price : joi.number().required(),
        discount : joi.number().max(100)
    }),

    headers: glopalSchema.headers.required(),

    files: joi.object({
        images: joi.array().items(glopalSchema.file).required(),
        image:joi.array().items(glopalSchema.file).required()
    }) 
} 

export const updateProudctSchema = {
    body: joi.object({
        title: joi.string(),
        stock : joi.number(),
        descreption : joi.string(),
        price : joi.number(),
        discount : joi.number().max(100)
    }),

    headers: glopalSchema.headers.required(),

    files: joi.object({
        images: joi.array().items(glopalSchema.file),
        image:joi.array().items(glopalSchema.file)
    }) 
} 