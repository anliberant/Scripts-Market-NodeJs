import mongoose from "mongoose";
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    scripts: [{
        script: {
            type: Object,
            required: true,
        },
        count: {
            type: Number,
            required: true
        }
    }],
    user: {
        name: String,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Order', orderSchema);