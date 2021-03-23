import {
    Router
} from 'express';
import auth from './../middleware/auth.js';
import Script from '../models/script.js';

const router = Router();

function mapCartItems(cart) {
    return cart.items.map(s => ({
        ...s.scriptId._doc,
        count: s.count
    }));
}

function computePrice(scripts) {
    return scripts.reduce((total, script) => {
        return total += script.price * script.count;
    }, 0);
}

router.post('/add', auth, async (req, res) => {
    const script = await Script.findById(req.body.id);
    await req.user.addToCart(script);
    res.redirect('/cart');
});

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user.populate('cart.items.scriptId').execPopulate();
    const scripts = mapCartItems(user.cart);
    const cart = {
        scripts,
        price: computePrice(scripts)
    };
    res.status(200).json(cart);
});

router.get('/', auth, async (req, res, next) => {
    if (req.user) {
        const user = await req.user.populate('cart.items.scriptId').execPopulate();
        const scripts = mapCartItems(user.cart);
        res.render('cart', {
            title: 'Cart',
            scripts,
            price: computePrice(scripts),
            isCart: true,
        });
    }
});


export default router;