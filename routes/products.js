const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
//const verifyToken = require('../verifyToken')


// Suspend verifyToken for testing
router.get("/", /*verifyToken,*/ async (req,res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.json({message: err})
    }
})

router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        rating: req.body.rating,
        numreviews: req.body.numreviews
    })

    const savedproduct = await product.save()
        try {
            res.json(savedproduct)
        } catch (err) {
            res.json({message: err})
        }
})

router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)
        res.json(product)
    } catch (err) {
        res.json({message: err})
    }
})

router.delete('/:productId', async (req, res) => {
    try {
        const removedProduct = await Product.deleteOne({_id: req.params.productId})
        res.json(removedProduct)
    } catch (err) {
        res.json({message: err})
    }
})

router.patch('/:productId', async (req, res) => {
    try {
        const updatedProduct = await Product.updateOne(
            {_id: req.params.productId}, 
            { $set: {name: req.body.name}})
        res.json(updatedProduct)
    } catch (err) {
        res.json({message: err})
    }
})

module.exports = router