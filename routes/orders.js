import {
    Router
} from 'express';
import auth from './../middleware/auth.js';
import Order from './../models/order.js';

const router = new Router();

router.get('/', auth, async (req, res, next) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId');
        res.render('orders', {
            title: 'Orders',
            isOrder: true,
            orders: orders.map(order => {
                return {
                    ...order._doc,
                    price: order.scripts.reduce((total, script) => {
                        return total + script.count * script.script.price
                    }, 0)
                }
            })
        });
    } catch (err) {
        console.error(err);
    }
});

router.post('/', auth, async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.scriptId').execPopulate();
        const scripts = user.cart.items.map(s => ({
            count: s.count,
            script: {
                ...s.scriptId._doc
            }
        }));
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            scripts
        });

        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (err) {
        console.log(err);
    }
})

export default router;