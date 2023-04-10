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
        const { _sort = "createAt", _order = "asc", _limit = 100, _page = 1, _expand = false } = req.query;
        const options = {
            page: _page,
            limit: _limit,
            sort: {
                [_sort]: _order === "desc" ? -1 : 1,
            },
        };
        const populated = _expand === "" ? [{
            path: 'categories'
        }, {
            path: 'comments'
        }] : [{
            path: 'comments'
        }]
        const products = await Product.paginate({}, { ...options, populate: populated });

        if (products.docs.length === 0) {
            res.json({
                message: "No products found",
            })
        } else {
            res.json({
                message: "Get all products successfully",
                data: products.docs,
                pagination: {
                    currentPage: products.page,
                    totalPages: products.totalPages,
                    totalItems: products.totalDocs,
                },
            })
        }
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const getDetailProducts = async (req, res) => {
    try {
        const product = await Product.find({ _id: req.params.id }).populate(['categories', 'comments'])
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
        const { isHardDelete } = req.body;

        if (isHardDelete) {
            product.categories.forEach(async cate => {
                await Category.findOneAndUpdate(cate, {
                    $pull: {
                        products: product._id
                    }
                })

            });
            await product.forceDelete()
        } else {
            await product.delete()
        }


        res.json({
            message: "Delete product successfully",
            data: product
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const restorePrd = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        const product = await Product.findById(id);

        if (!user.role || user.role !== "admin") {
            return res.status(403).json({
                message: "Bạn không có quyền phục hồi sản phẩm",
            });
        }
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }
        if (!product.deleted) {
            return res.status(400).json({
                message: "Sản phẩm chưa bị xóa mềm",
            });
        }

        product.deleted = false;
        product.deletedAt = null;

        const restoredProduct = await product.save();

        return res.status(200).json({
            message: "Phục hồi sản phẩm thành công",
            data: restoredProduct,
        });
    } catch (error) {
        res.status(400).json({
            message: "Phục hồi sản phẩm không thành công",
            error: error.message
        });
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
            const product = await Product.findOne({ _id: req.params.id })
            if (!product) {
                return res.status(400).send({
                    message: "Không lấy được sản phẩm"
                })
            }

            //remove id product from Category if product delete categoryId
            product.categories.forEach(async cate => {
                console.log(cate, 1);
                await Category.findOneAndUpdate(cate, {
                    $pull: {
                        products: product._id
                    }
                })
            })

            //add id product from Category if product add categoryId
            req.body.categories.forEach(async cate => {
                console.log(cate, 2);
                await Category.findOneAndUpdate({ _id: cate }, {
                    $addToSet: {
                        products: product._id
                    }
                })
            })

            await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        createProducts,
        restorePrd
    }