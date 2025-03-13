import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import main from "../../services/sendEmail.js";
import asyncHandler from '../../services/asyncHandler.js';
import sendVerfyingEmail from '../../services/sendVerfyingEmail.js';
import { userModel } from '../../db/models/user.model.js';
import AppError from '../../services/AppError.js';
import { OAuth2Client } from "google-auth-library";

dotenv.config()

const client = new OAuth2Client(process.env.CLIENT_ID);

async function verifyGoogleToken(idToken) {
	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.CLIENT_ID,
		})
		return ticket.getPayload() 
	} catch (error) {
		console.error("Error verifying Google ID Token:", error)
		throw new Error("Invalid ID Token")

	}
}


export const googleLogin = asyncHandler( async (req, res,next) => {
	const { idToken } = req.body
		const payload = await verifyGoogleToken(idToken)

		const { name, email } = payload

		let user = await userModel.findOne({ email })

		if (!user) {
			user = new userModel({
				name,
				email,
				provider: "google",
			})
			await user.save()
		}

        let token = jwt.sign({ email: user.email }, "ali")

		res.status(200).json({
			message: "Login successful",
			user: {
				token,
				provider: user.provider,
			},
		})

})





export const getUsers = asyncHandler(async (req, res, next) => {
    let user = await userModel.find().select("-password -_id -__v")
    return res.status(200).json({ msg: 'sucsses', user })
})




export const signUp = asyncHandler(async (req, res, next) => {
    let hashed = bcrypt.hashSync(req.body.password, Number(process.env.SALT))
    req.body.password = hashed
    await sendVerfyingEmail(req, req.body.email)

    let user = await userModel.create(req.body)
    return res.status(200).json({ msg: 'sucsses', user })
})


export const verfiyng = asyncHandler(async (req, res, next) => {
    let { token } = req.params
    let { email } = jwt.verify(token, process.env.SECRET)
    let user = await userModel.findOneAndUpdate({ email, confirmed: false }, { confirmed: true })
    if (!user) {
        return res.status(404).json({ msg: 'user not found or alerdy verfayied' })
    }
    return res.status(200).json({ msg: 'verfiy sucsses' })
})

export const reVerfiyng = asyncHandler(async (req, res, next) => {
    let { reToken } = req.params
    let { email } = jwt.verify(reToken, process.env.SECRET)
    let user = await userModel.findOne({ email, confirmed: false })

    if (!user) {
        return res.status(404).json({ msg: 'user not found or alerdy verfayied' })
    }
    sendVerfyingEmail(req, email)

    return res.status(200).json({ msg: 'reVerfiy sucsses' })
})

export const forgetPassword = asyncHandler(async (req, res, next) => {
    let { email } = req.body
    let user = await userModel.findOne({ email })
    if (!user) {
        return res.status(404).json({ msg: 'user not found' })
    }
    let code = nanoid(5)
    user.code = code
    await user.save()

    main(email, `<h1>your password reset code is ${code}</h1>`, "password reset")
    .then(()=>{
        return res.status(200).json({ msg: 'verfiy sucsses' })
    
    })
    .catch(e=>{
        return res.status(200).json({ msg: 'error' , e , details: e.message })
    })
    

    
})

export const resetPassword = asyncHandler(async (req, res, next) => {
    let { code, password } = req.body
    let user = await userModel.findOne({ code })
    if (!user) {
        return res.status(404).json({ msg: 'user not found or code is not valid' })
    }
    let hashed = bcrypt.hashSync(password, Number(process.env.SALT))
    user.password = hashed
    user.code = ''
    user.passwordChangedAt = Date.now()
    await user.save()
    return res.status(200).json({ msg: "sucsses" })
})

export const login = asyncHandler(async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email.toLowerCase() })

    if (!user.confirmed) {
        return next(new AppError('email not verfayied', 403))
    }

    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        return next(new AppError('invalid email or password', 401))
    }

    let token = jwt.sign({ email: req.body.email }, process.env.SECRET)
    user.loggedIn = true
    await user.save()
    return res.status(200).json({ msg: 'sucsses', token })

})

export const updateUser = asyncHandler(async (req, res, next) => {

    if (req.body.email) {
        if(req.body.email == req.user.email){
            return next(new AppError('email is the same' , 400))
        }
        let emailExist = await userModel.findOne({ email: req.body.email })
        if (emailExist && emailExist._id.toString() !== req.user._id.toString()) {

            return next(new AppError('email already exist' , 409))
        }
        sendVerfyingEmail(req, req.body.email)
        .then(()=>{
            return res.status(200).json({ msg: 'verfiy sucsses' })
        }).catch(e=>{
            return res.status(200).json({ msg: 'error' , e , details: e.message })
        })
        req.body.confirmed = false
    }

    let user = await userModel.findOneAndUpdate({ email: req.user.email }, req.body, { new: true })
    if (!user) {
        next(new AppError('user not found' , 404))
    }
    return res.status(200).json({ msg: 'sucsses', user })

})


export const ubdatePassword = asyncHandler(async (req, res, next) => {
    let { password, newPassword } = req.body
    if (!req.user || !bcrypt.compareSync(password, req.user.password)) {
        return res.status(401).json({ msg: 'invalid old password' })
    }
    let hashed = bcrypt.hashSync(newPassword, Number(process.env.SALT))
    req.user.password = hashed
    req.user.passwordChangedAt = Date.now()
    await req.user.save()
    return res.status(200).json({ msg: 'sucsses' })
})

export const deleteUser = asyncHandler(async (req, res, next) => {


    let user = await userModel.findOneAndDelete({ email: req.user.email })

    if (!user) {
        next(new AppError('user not found' , 404))
    }


    return res.status(200).json({ msg: 'user deleted' , user })
})