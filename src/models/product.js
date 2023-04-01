import mongoose from "mongoose";
const { Schema } = mongoose;

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
    // image: {
    //     type: String,
    //     required: true,
    // },
    description: {
        type: String,
        minLength: 32
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ]
},
    { timestamps: true, versionKey: false }
)

export default mongoose.model('Product', productSchema)