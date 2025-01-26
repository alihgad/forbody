import express from 'express'
import connectionDB from './src/db/connection.js'
const app = express()
const port = process.env.PORT || 3000
connectionDB
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))