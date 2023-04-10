import mongoose from "mongoose";
const { Schema } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";

const commentSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ,
    userName: {
        type: String,
        require: true
    },
    subject:  {
        type: String,
        require: true
    },
    content:  {
        type: String,
        require: true
    },
},
    { timestamps: true, versionKey: false }
)
commentSchema.plugin(mongoosePaginate);
export default mongoose.model('Comment', commentSchema)