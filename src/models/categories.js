import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
},
    { timestamps: true, versionKey: false }
)

export default mongoose.model('Category', categorySchema)