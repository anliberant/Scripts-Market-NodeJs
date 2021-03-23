import keysdev from './keys.dev.js';
import keysprod from './keys.prod.js';
let keys;
if (process.env.NODE_ENV === 'production') {
    keys = keysprod;
} else {
    keys = keysdev;
}

export default keys;