import {
    Router
} from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid-transport';
import {
    validationResult
} from 'express-validator';
import crypto from 'crypto';

import User from './../models/user.js';
import keys from './../keys/index.js';
import regMail from './../emails/registration.js';
import resetMail from './../emails/reset.js';
import {
    registerValidators
} from './../utils/validators.js';

const router = Router();

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: keys.SENDGRID_API_KEY
    }
}));

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError'),
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const candidate = await User.findOne({
            email
        });
        if (candidate) {
            const isSame = await bcrypt.compare(password, candidate.password);
            if (isSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/');
                });
            } else {
                req.flash('loginError', 'Wrong password');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'User not found');
            res.redirect('/auth/login#login');
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {
            email,
            password,
            name
        } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            name,
            password: hashPassword,
            cart: {
                items: []
            }
        });
        await user.save();
        res.redirect('/auth/login#login');
        await transporter.sendMail(regMail(email));
    } catch (err) {
        console.log(err);
    }
});

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Reset Password',
        error: req.flash('error')
    });
});

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {
                $gt: Date.now()
            }
        });
        if (!user) {
            return res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'Reset password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            });
        }
        res.render('auth/reset', {
            title: 'Reset Password',
            error: req.flash('error')
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buf) => {
            if (err) {
                req.flash('error', 'Something went wrong, please try again');
                return res.redirect('/auth/reset');
            }

            const token = buf.toString('hex');
            const candidate = await User.findOne({
                email: req.body.email
            });
            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetMail(candidate.email, token));
                res.redirect('/auth/login');
            } else {
                req.flash('error', 'Email not found');
                res.redirect('/auth/reset');
            }
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {
                $gt: Date.now()
            }
        });
        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');
        } else {
            req.flash('loginError', 'Token has expired');
            res.redirect('/auth/login');
        }
    } catch (err) {
        console.log(err);
    }
});

export default router;