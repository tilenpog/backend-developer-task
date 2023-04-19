const bcrypt = require('bcrypt');
const { getUserByUsername } = require('../controllers/userController');


const RequiredAuth = async(req, res, next) => {
    const authInfo = await authenticate(req);
    if (!authInfo.isAuthorized) {
        return unauthorizedMessage(res);
    }

    req.authInfo = authInfo; 
    return next();
}

const OptionalAuth = async(req, res, next) => {
    if (!req.headers.authorization) {
        req.authInfo = getAuthInfo(false, null);
        return next();
    }

    return RequiredAuth(req, res, next);
}

const unauthorizedMessage = res => res.status(401).json({ message: "Unauthorized" });

const authenticate = async(req) => {
    var token = req.headers.authorization;
    if (!token) {
        return getAuthInfo(false, null);
    }
    
    const [username, password] = new Buffer.from(token.split(' ')[1], 'base64').toString().split(':');

    const user = await getUserByUsername(username);
    if (!user) {
        return getAuthInfo(false, null);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password || '');
    if (!isPasswordCorrect) {
        return getAuthInfo(false, null);
    }

    return getAuthInfo(true, user);
}

const getAuthInfo = (isAuthorized, user) => {
    return {isAuthorized, user};
}

module.exports = { RequiredAuth, OptionalAuth };