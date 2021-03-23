import keys from './../keys/index.js';

export default function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account created successfully',
        html: `
            <h1>Welcome to FlippyScripts</h1>
            <p>Your account has been created successfully with email - ${email}</p>
            <hr />
            <a href="${keys.BASE_URL}">Flippy Scripts</a>
        `
    }
}