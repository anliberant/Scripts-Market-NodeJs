import multer from 'multer';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}


export default multer({
    storage,
    fileFilter
});