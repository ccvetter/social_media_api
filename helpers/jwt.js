const expressJwt = require('express-jwt');
const userService = require('../users/users.service');

module.exports = jwt;

function jwt() {
    const secret = global.Config.secret;

    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            '/api/users/authenticate',
            '/api/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    if (!user) {
        return done(null, true);
    }

    done();
}
