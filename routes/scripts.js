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

function isOwner(script, req) {
    return script.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res, next) => {
    try {
        const scripts = await Script.find().populate('userId', 'email name').lean();
        res.render('scripts', {
            title: 'All Scripts',
            isScripts: true,
            userId: req.user ? req.user._id.toString() : null,
            scripts
        });
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id/edit/', auth, async (req, res, next) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    try {
        const script = await Script.findById(req.params.id).lean();
        if (!isOwner(script, req)) {
            return res.redirect('/scripts/');
        }
        res.render('script_edit', {
            title: 'Edit' + script.title,
            script
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/edit/', auth, scriptValidators, async (req, res, next) => {
    const errors = validationResult(req);
    const {
        id
    } = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/scripts/${id}/edit?allow=true`);
    }

    try {
        delete req.body.id;
        const script = await Script.findById(id);
        if (!isOwner(script, req)) {
            res.redirect('/scripts');
        }
        Object.assign(script, req.body);
        await script.save();
        res.redirect('/scripts');
    } catch (err) {
        console.log(err);
    }
});

router.post('/remove', auth, async (req, res, next) => {
    try {
        await Script.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        });
        res.redirect('/scripts');
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const script = await Script.findById(req.params.id).lean();
        res.render('script', {
            title: `Script ${script.title}`,
            script,
            layout: 'empty',
        });
    } catch (err) {
        console.log(err);
    }
});

export default router;