import Product from '../models/product';
import Joi from 'joi';

const productSchema = Joi.object({
    name: Joi.string().required().min(3),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    description: Joi.string().min(32)
})

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('categories')
        if (products.length === 0) {
            res.json({
                message: "No products found",
            })
        } else {
            res.json({
                message: "Get all products successfully",
                data: products
            })
        }
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const getDetailProducts = async (req, res) => {
    try {
        const product = await Product.find({ _id: req.params.id })
        if (product.length === 0) {
            res.json({
                message: "No product found",
            })
        } else {
            res.json({
                message: "Get product successfully",
                data: product
            })
        }
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const removeProducts = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })
        await Product.findOneAndDelete({ _id: req.params.id })
        res.json({
            message: "Delete product successfully",
            data: product
        })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const patchProducts = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body, { abortEarly: false })
        if (error) {
            const errs = []
            for (const err of error.details) {
                errs.push(err.message)
            }
            return res.json({
                message: 'Form error',
                errors: errs
            })
        }
        await Product.replaceOne({ _id: req.params.id }, req.body)
        const product = await Product.findOne({ _id: req.params.id })
        res.json({
            message: "Update product successfully",
            data: product
        })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}


const createProducts = async (req, res) => {
    try {
        console.log(req.user);
        const { error } = productSchema.validate(req.body, { abortEarly: false })
        if (error) {
            const errs = []
            for (const err of error.details) {
                errs.push(err.message)
            }
            return res.json({
                message: 'Form error',
                errors: errs
            })
        }
        await Product.create(req.body)
        const products = await Product.find({})
        res.json({
            message: "Create product successfully",
            data: products
        })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

export const product = {
    getAllProducts,
    getDetailProducts,
    removeProducts,
    patchProducts,
    createProducts
}