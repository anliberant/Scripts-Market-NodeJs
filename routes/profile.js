import {
    Router
} from 'express';
import auth from './../middleware/auth.js';
import User from './../models/user.js';

const router = Router();

router.get('/', auth, async (req, res, next) => {
    res.render('profile', {
        title: 'Profile',
        isProfile: true,
        user: req.user.toObject()
    });
});

router.post('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const toChande = {
            name: req.body.name,
        }
        if (req.file) {
            toChande.avatarUrl = req.file.path
        }
        Object.assign(user, toChande);
        await user.save();
        res.redirect('/profile');
    } catch (err) {
        console.log(err);
    }
});

export default router;