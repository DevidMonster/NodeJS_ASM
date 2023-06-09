import mongoose from "mongoose";
const { Schema } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        minLength: 32
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    // deletedAt: {
    //     type: Date,
    //     default: null,
    // },
    // deleted: {
    //     type: Boolean,
    //     default: false,
    // },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]

},
    { timestamps: true, versionKey: false }
)
productSchema.plugin(mongoosePaginate);

export default mongoose.model('Product', productSchema)