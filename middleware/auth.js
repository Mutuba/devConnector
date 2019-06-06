const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function(req, res, next) {
  //get token
  const token = req.headers["x-auth-token"];
  //check if token
  if (!token) {
    return res.status(401).json({ msg: "Missing token. Access denied" });
  }
  //verify token
  try {
    const decodedToken = jwt.verify(token, config.get("jwtSecret"));
    req.user = decodedToken.user;
    next();
  } catch {
    //catch an error incase the token is invalid
    res.status(401).json({ msg: "Invalid token" });
  }
};
