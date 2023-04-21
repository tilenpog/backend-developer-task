const bcrypt = require("bcrypt");
const { getUserByUsername } = require("../controllers/userController");

const unauthorizedMessage = (res) =>
  res.status(401).json({ message: "Unauthorized" });

const unauthorizedAuthInfo = () => {
  return { isAuthorized: false, user: null };
};
const authorizedAuthInfo = (user) => {
  return { isAuthorized: true, user };
};

const RequireAuth = async (req, res, next) => {
  const authInfo = await authenticate(req);
  if (!authInfo.isAuthorized) {
    return unauthorizedMessage(res);
  }

  req.authInfo = authInfo;
  return next();
};

const OptionalAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    req.authInfo = unauthorizedAuthInfo();
    return next();
  }

  return RequireAuth(req, res, next);
};

const authenticate = async (req) => {
  var token = req.headers.authorization;
  if (!token) {
    return unauthorizedAuthInfo();
  }

  const [username, password] = new Buffer.from(token.split(" ")[1], "base64")
    .toString()
    .split(":");

  const user = await getUserByUsername(username);
  if (!user) {
    return unauthorizedAuthInfo();
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
  if (!isPasswordCorrect) {
    return unauthorizedAuthInfo();
  }

  return authorizedAuthInfo(user);
};

module.exports = { RequireAuth, OptionalAuth };
