import mongoose from "mongoose";
const Schema = mongoose.Schema;
const scriptSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default mongoose.model('Script', scriptSchema);