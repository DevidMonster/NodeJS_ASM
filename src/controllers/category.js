import Category from '../models/category';
import Joi from 'joi';

const categorySchema = Joi.object({
    name: Joi.string().required().min(3),
    categories: Joi.array().items(Joi.string())
})

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).populate('products')
        if (categories.length === 0) {
            res.json({
                message: "No category found",
            })
        } else {
            res.json({
                message: "Get all categories successfully",
                data: categories
            })
        }
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const getDetailCategory = async (req, res) => {
    try {
        const category = await Category.find({ _id: req.params.id })
        if (category.length === 0) {
            res.json({
                message: "No category found",
            })
        } else {
            res.json({
                message: "Get category successfully",
                data: category
            })
        }
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const removeCategories = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id })
        await Category.findOneAndDelete({ _id: req.params.id })
        res.json({
            message: "Delete category successfully",
            data: category
        })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

const patchCategories = async (req, res) => {
    try {
        const { error } = categorySchema.validate(req.body, { abortEarly: false })
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
        await Category.replaceOne({ _id: req.params.id }, req.body)
        const category = await Category.findOne({ _id: req.params.id })
        res.json({
            message: "Update category successfully",
            data: product
        })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}


const createCategory = async (req, res) => {
    try {
        console.log(req.user);
        const { error } = categorySchema.validate(req.body, { abortEarly: false })
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
        await Category.create(req.body)
        const category = await Category.find({})
        res.json({
            message: "Create category successfully",
            data: products
        })
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

export const category = {
    getAllCategories,
    getDetailCategory,
    removeCategories,
    createCategory,
    patchCategories
}