const jwt = require("jsonwebtoken");

const isLoggedIn = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        // const token = authHeader.split(" ")[1];
        const token = authHeader;

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                res.status(403).json(err);
                return;
            }
            req.user = user.user;
            // console.log("USER", req.user)
            next();
        });
    } else {
        res.status(401).json("You are not authenticated!");
    }
}

module.exports = isLoggedIn