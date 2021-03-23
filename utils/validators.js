import {
    body
} from 'express-validator';

import User from './../models/user.js';

const registerValidators = [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (value, {
        req
    }) => {
        try {
            const user = await User.findOne({
                email: value
            });
            if (user) {
                return Promise.reject('Email already registered');
            }
        } catch (err) {
            console.log(err);
        }
    }).normalizeEmail(),

    body('password', 'Please enter a valid password')
    .isLength({
        min: 6,
        max: 20
    })
    .isAlphanumeric()
    .trim(),

    body('confirm')
    .custom((val, {
        req
    }) => {
        if (val !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }).trim(),

    body('name')
    .isLength({
        min: 3
    })
    .withMessage('Please enter a valid name')
    .trim()
]

const scriptValidators = [
    body('title').isLength({
        min: 3
    }).withMessage('Please enter at least 3 characters').trim(),

    body('price').isNumeric().withMessage('Please enter a valid price'),

    body('description').isLength({
        min: 30
    }).withMessage('Please enter at least 30 characters'),

    body('img', 'Please enter a valid image url'),
]

export {
    registerValidators,
    scriptValidators
};