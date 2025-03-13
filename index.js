import express from 'express'
import connectionDB from './src/db/connection.js'
import userRouter from './src/moduels/user/user.routes.js'
import productRouter from './src/moduels/product/product.routes.js'
import cartRouter from './src/moduels/cart/cart.routes.js'
import cors from 'cors'
const app = express()
const port = process.env.PORT || 3000

connectionDB
app.use(cors({
    whiteList: ['http://localhost:3000']
}))
app.use(express.json())
app.use("/user",userRouter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)
app.use((err , req , res , next)=>{return res.status(err.statusCode || 500).json({message: err.message , stack:err.stack})})
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))