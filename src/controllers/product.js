import Category from '../models/category';
import Product from '../models/product';
import Joi from 'joi';

const productSchema = Joi.object({
    name: Joi.string().required().min(3),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    description: Joi.string().min(32),
    categories: Joi.array().items(Joi.string()).required()
})  

const getAllProducts = async (req, res) => {
    try {
        const { _sort = "createAt", _order = "asc", _limit = 10, _page = 1 } = req.query;
        const options = {
            page: _page,
            limit: _limit,
            sort: {
                [_sort]: _order === "desc" ? -1 : 1,
            },
            populate: {
                path: 'categories',
                select: 'name'
            }
        };
        const products = await Product.paginate({}, options);

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
        const product = await Product.find({ _id: req.params.id }).populate('categories')
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
        await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const products = await Product.create(req.body)
        console.log(products)
        if (!product) { 
            return res.json({
                message: "Không thêm sản phẩm",
            });
        }
        for(const cateId of products.categories) {
            const categpry =  await Category.findByIdAndUpdate(cateId, {
                $addToSet: {
                    products: product._id,
                },
            },{ new: true });
            console.log(categpry);
        }
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