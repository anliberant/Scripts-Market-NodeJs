import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: String,
    password: {
        type: String,
        required: true,
    },
    resetToken: String,
    avatarUrl: String,
    resetTokenExp: Date,
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1,
            },
            scriptId: {
                type: Schema.Types.ObjectId,
                ref: 'Script',
                required: true,
            }
        }]
    }
});

userSchema.methods.addToCart = function (script) {
    const items = [...this.cart.items];
    const idx = items.findIndex(s => s.scriptId.toString() === script._id.toString());
    if (idx >= 0) {
        items[idx].count++;
    } else {
        items.push({
            scriptId: script._id,
            count: 1
        });
    }

    this.cart = {
        items
    };

    return this.save();
};

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items];
    const idx = items.findIndex(s => s.scriptId.toString() === id.toString());
    if (items[idx].count === 1) {
        items = items.filter(s => s.scriptId.toString() !== id.toString());
    } else {
        items[idx].count--;
    }
    this.cart = {
        items
    };
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    };
    return this.save();
}

export default mongoose.model('User', userSchema);