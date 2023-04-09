import mongoose from "mongoose";
const { Schema } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";

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
categorySchema.plugin(mongoosePaginate);
export default mongoose.model('Category', categorySchema)