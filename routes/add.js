import {
    Router
} from 'express';
import {
    validationResult
} from 'express-validator';
import auth from './../middleware/auth.js';
import Script from './../models/script.js';
import {
    scriptValidators
} from './../utils/validators.js';
const router = Router();

router.get('/', auth, (req, res, next) => {
    res.render('add', {
        title: 'Add Script',
        isAdd: true
    });
});

router.post('/', auth, scriptValidators, async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Add Script',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                img: req.body.img
            }
        })
    }

    const script = new Script({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        img: req.body.img,
        userId: req.user
    });
    try {
        await script.save();
        res.redirect('/scripts');
    } catch (err) {
        console.log(err);
    }
});

export default router;