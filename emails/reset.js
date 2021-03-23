import keys from './../keys/index.js';

export default function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Password reset',
        html: `
            <h1>Forgot your password?</h1>
            <p>If not, just ignore the email</p>
            <p>Else click on the link:</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset Password</a></p>
            <hr />
            <a href="${keys.BASE_URL}">Flippy Scripts</a>
        `
    }
}