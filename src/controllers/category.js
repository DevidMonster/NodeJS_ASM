import Category from '../models/category';
import Joi from 'joi';
import Product from '../models/product';

const categorySchema = Joi.object({
    name: Joi.string().required().min(3),
    products: Joi.array().items(Joi.string()).required()
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
        res.status(500).send({ message: err.message })
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
        res.status(500).send({ message: err.message })
    }
}

const removeCategories = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id })

        const products = await Product.find({})
        for (const product of products) {
            if (product.categories.includes(category._id)) {
                console.log(category._id)
                await Product.findByIdAndUpdate(product._id, {
                    $pull: {
                        categories: category._id
                    }
                });
            }
            // product.categories.forEach(async (cate) => {
            //     if (cate == category._id) {
            //         console.log(cate, category._id)
            //         await Product.findByIdAndUpdate(product._id, {
            //              $pull: {
            //                  categories: cate
            //              }
            //         });
            //     }
            // })
        }
        await Category.findOneAndDelete({ _id: req.params.id })
        res.json({
            message: "Delete category successfully",
            data: category
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
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
        await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
        const category = await Category.findOne({ _id: req.params.id })
        res.json({
            message: "Update category successfully",
            data: category
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
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
        const category = await Category.create(req.body)
        res.json({
            message: "Create category successfully",
            data: category
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const category = {
    getAllCategories,
    getDetailCategory,
    removeCategories,
    createCategory,
    patchCategories
}