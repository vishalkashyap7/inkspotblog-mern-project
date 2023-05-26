const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeader = req.headers.token;
  // console.log("start from here", req.headers.token, "authHeader in verify");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log("token is ", token);
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).json("Token is not valid!");
        // console.log("error in the verify");
      }
      else {
        req.user = user;
        // console.log("jwt verified");
        next();
      }
    });
  } else {
    // console.log("unauth");
    return res.status(401).json("You are not authenticated!");
  }
}

module.exports = verify;
