const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require('passport');

const User = require("../models/User");

router.post("/add-user", async(req, res) => {
    const {email, password, name, phone} = req.body;
    try {
        const user = await User.findOne({email:email}).exec();
        if(user) {
            res.status(401).json("User already exists");
            return;
        } else {
            const salt = await bcrypt.genSalt(10);
            console.log(salt, password);
            const hashedPassword = await bcrypt.hash(password, salt);
            await User.create({email, password:hashedPassword, name, phone});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json(err);
        return;
    }
    res.json("User Created");
});

router.post("/login-user", async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(404).json("user not found");
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            return res.status(403).json("wrong password");
        }
        const accessToken = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn:"1d"});
        res.json({accessToken: "Bearer "+accessToken});
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        // res.redirect('/login');
        if (err) return next(err);
        console.log(user)
        return res.json(user)
        if (!user) return res.redirect('/login'); // Handle authentication failure
        
        // Create a JWT token and send it to the client
        // const accessToken = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn:"1d"});
        // return res.json({ accessToken: "Bearer "+accessToken });
    })(req, res, next);
})

module.exports = router;