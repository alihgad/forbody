import { Router } from "express";
import { deleteUser, forgetPassword, getUsers, googleLogin, login, resetPassword, reVerfiyng, signUp, ubdatePassword, updateUser, verfiyng } from "./user.controler.js";
import { signUpSchema , resetPasswordSchema, loginSchema, updateUserSchema, updatePasswordSchema, deleteSchema } from "./userSchemas.js";
import auth from "../../services/auth.js";
import GValidator from "../../services/GValidator.js";

let userRouter = Router()
let all = ["user","admin"]

userRouter.get('/',getUsers );
userRouter.post('/',GValidator(signUpSchema), signUp);
userRouter.post('/googleLogin', googleLogin);
userRouter.get('/verfiy/:token',verfiyng );
userRouter.get('/reVerfiy/:reToken',reVerfiyng );
userRouter.post('/forgetPassword' ,forgetPassword );
userRouter.post('/resetPassword',GValidator(resetPasswordSchema),resetPassword );
userRouter.post('/logIn',GValidator(loginSchema), login);
userRouter.put('/updateUser',GValidator(updateUserSchema),auth(all), updateUser);
userRouter.patch('/updatePassword',GValidator(updatePasswordSchema),auth(all), ubdatePassword);
userRouter.delete('/deleteUser',GValidator(deleteSchema),auth(all), deleteUser);


export default userRouter