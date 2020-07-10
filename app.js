const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Import Routes
const productsRoute = require('./routes/products')
const authRoute = require('./routes/auth')

app.use('/products', productsRoute)
app.use('/user', authRoute)

//Routes
app.get('/', (req,res) => {
    res.send('We are on home')
})

//DB Connect
mongoose.connect(process.env.MONGO_D_KEY, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("you did it!")
})

app.listen(process.env.PORT || 3000)