import express from 'express'
import connectionDB from './src/db/connection.js'
import userRouter from './src/moduels/user/user.routes.js'
import productRouter from './src/moduels/product/product.routes.js'
import cartRouter from './src/moduels/cart/cart.routes.js'
const app = express()
const port = process.env.PORT || 3000
connectionDB
app.use(express.json())
app.use("user",userRouter)
app.use("product",productRouter)
app.use("cart",cartRouter)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))