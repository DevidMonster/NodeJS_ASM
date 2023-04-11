import Category from '../models/category';
import Joi from 'joi';
import Product from '../models/product';

const categorySchema = Joi.object({
    name: Joi.string().required().min(3),
    products: Joi.array().items(Joi.string())
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
    const categoryId = req.params.id;
    const { _page = 1, _limit = 10, _sort = "createdAt", _order = "asc", _embed } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: { [_sort]: _order === "desc" ? -1 : 1 },
    };
    const populateOptions = _embed !== undefined ? [{ path: "products"}] : [];
    try {
        const category = await Category.find({ _id: categoryId })
        if (category.length === 0) {
            return res.json({
                message: "No category found",
            })

        }
        const results = await Category.paginate({ _id: categoryId }, { ...options, populate: populateOptions});
        console.log(results.docs);
        if (results.docs.length === 0) {
            return res.status(404).json({
                message: "No products found in this category",
            });
        }
        if (_embed !== undefined) {
            return res.json({   
                data: {
                    category,
                    products: results.docs[0].products,
                },
                pagination: {
                    currentPage: results.page,
                    totalPages: results.totalPages,
                    totalItems: results.totalDocs,
                },
            });
        } else {
            return res.status(200).json({
                data: results.docs,
                pagination: {
                    currentPage: results.page,
                    totalPages: results.totalPages,
                    totalItems: results.totalDocs,
                },
            });
        
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