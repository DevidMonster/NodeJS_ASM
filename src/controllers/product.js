import Category from '../models/category';
import Product from '../models/product';
import Joi from 'joi';

const productSchema = Joi.object({
    name: Joi.string().required().min(3),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
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
        res.status(500).send({ message: err.message })
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
        res.status(500).send({ message: err.message })
    }
}

const removeProducts = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })

        const categories = await Category.find({})
        for (const category of categories) {
            if (category.products.includes(product._id)) {
                console.log(product._id)
                await Category.findByIdAndUpdate(category._id, {
                    $pull: {
                        products: product._id
                    }
                });
            }
        }
        await Product.findOneAndDelete({ _id: req.params.id })

        res.json({
            message: "Delete product successfully",
            data: product
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
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
        const product = await Product.findOne({ _id: req.params.id }).populate('categories')
        if (!product) {
            return res.status(400).send({
                message: "Không lấy được sản phẩm"
            })
        }

        const categories = await Category.find({}).populate('products')
        //remove id product from Category if product delete categoryId
        for (const category of categories) {
            category.products.forEach(async (prd) => {
                if (!prd.categories.includes(product._id))
                    await Category.findByIdAndUpdate(category._id, {
                        $pull: {
                            products: product._id
                        }
                    });
            })
        }

        //add id product from Category if product add categoryId
        product?.categories.forEach(async (cate) => {
            if (!cate.products.includes(product._id)) {
                await Category.findByIdAndUpdate(cate._id, {
                    $addToSet: {
                        products: product._id,
                    },
                });
            }
        })
        res.json({
            message: "Update product successfully",
            data: product
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
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
            return res.status(400).send({
                message: 'Form error',
                errors: errs
            })
        }
        const product = await Product.create(req.body)
        if (!product) {
            return res.status(400).send({
                message: "Không thêm sản phẩm",
            });
        }
        product?.categories.forEach(async (cate) => {
            try {
                console.log(cate);
                await Category.findByIdAndUpdate(cate, {
                    $addToSet: {
                        products: product._id,
                    },
                });
            } catch (error) {
                return res.status(400).send({
                    message: "Lỗi khi thêm sản phẩm",
                });
            }
        });

        res.json({
            message: "Create product successfully",
            data: product
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}

export const product = {
    getAllProducts,
    getDetailProducts,
    removeProducts,
    patchProducts,
    createProducts
}