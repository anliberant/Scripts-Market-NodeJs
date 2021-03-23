import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Handlebars from 'handlebars';
import csrf from 'csurf';
import flash from 'connect-flash';
import {
    allowInsecurePrototypeAccess
} from '@handlebars/allow-prototype-access';
import exphbs from 'express-handlebars';
import session from 'express-session';
import {
    default as connectMongoDBSession
} from 'connect-mongodb-session';
import helmet from 'helmet';
import compression from 'compression';

const MongoDBStore = connectMongoDBSession(session);
import {
    fileURLToPath
} from 'url';

import homeRoutes from './routes/home.js';
import addRoutes from './routes/add.js';
import scriptsRoutes from './routes/scripts.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import varMiddleware from './middleware/variables.js';
import userMiddleware from './middleware/user.js';
import fileMiddleware from './middleware/file.js';
import keys from './keys/index.js';
import helpers from './utils/hbs-helpers.js';
import {
    error404
} from './middleware/error.js';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: helpers
});

const store = new MongoDBStore({
    uri: keys.MONGODB_URI,
    collection: 'sessions'
});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({
    extended: true,
}));
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/scripts', scriptsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use(error404);

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        app.listen(PORT, () => {
            console.log('listening on port', PORT);
        });
    } catch (err) {
        console.log(err);
    }
}
start();