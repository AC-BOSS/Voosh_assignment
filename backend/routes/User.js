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
    if (!password) {
        return res.status(400).json("Password not provided");
    }
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
        res.cookie('accessToken', accessToken, { expires: new Date(Date.now() + 24*3600000) });
        res.json("Successfully Logged In");
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', async(err, user) => {
        if (err) return next(err);
        try {
            const email = user.emails[0].value;
            const name = user.displayName;

            existing_user = await User.findOne({ email: email });

            if(!existing_user) {
                existing_user = new User({email, name});
                await existing_user.save()
            }
            console.log()
            const accessToken = jwt.sign({user: existing_user}, process.env.JWT_SECRET, {expiresIn:"1d"});
            res.cookie('accessToken', accessToken);
            res.redirect('http://localhost:3000/');
        } catch (error) {
            res.redirect('http://localhost:3000/login');
        }
    })(req, res, next);
})

module.exports = router;