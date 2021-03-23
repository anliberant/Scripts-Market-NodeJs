import {
    Router
} from 'express';

const router = Router();

router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Flippy Scripts',
        isHome: true
    });
});

export default router;