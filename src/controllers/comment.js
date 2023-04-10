import Comment from "../models/comment";
import Product from "../models/product";

const getComments = async (req, res) => {
    try {
        const { _sort = "createAt", _order = "asc", _limit = 100, _page = 1, _expand = false} = req.query;
        const options = {
            page: _page,
            limit: _limit,
            sort: {
                [_sort]: _order === "desc" ? -1 : 1,
            },
        };
        const populated = _expand === "" ? [{
            path: 'userId'
        }, {
            path: 'productId'
        }] : []
        const cmts = await Comment.paginate({}, {...options, populate: populated});

        if (cmts.docs.length === 0) {
            res.json({
                message: "No cmts found",
            })
        } else {
            res.json({
                message: "Get all cmts successfully",
                data: cmts.docs,
                pagination: {
                    currentPage: cmts.page,
                    totalPages: cmts.totalPages,
                    totalItems: cmts.totalDocs,
                },
            })
        }
    } catch (error) {
        return res.status(400).send({
            message: error.message
        })
    }
}
const addComment = async (req, res) => {
    try {
        const prd = await Product.findOne({ _id: req.body.productId })
        if(!prd) {
            return res.status(404).send({ message: "Product not found" })
        }
        
        const comment = await Comment.create(req.body)
        await Product.findByIdAndUpdate({ _id: req.body.productId}, {
            $addToSet: {
                comments: comment._id
            }
        })
        return res.status(200).json({
            message: 'Add comment successfully',
            comment: comment
        })
    } catch (error) {
        return res.status(400).send({
            message: error.message
        })
    }
}

const removeComment = async (req, res) => {
    try {
        const { id } = req.params
        const cmt = await Comment.findOne({_id: id})
        
        await Product.findByIdAndUpdate({ _id: cmt.productId }, {
            $pull: {
                comments: id
            }
        })

        await Comment.findOneAndDelete({ _id: id })

        return res.status(200).json({
            message: 'Delete comment successfully',
            cmtHasDelete: cmt
        })

    } catch (error) {
        return res.status(404).send({
            message: error.message
        })
    }
}

export const comment = {
    addComment,
    removeComment,
    getComments
}