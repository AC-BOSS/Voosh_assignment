const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require('passport');

const User = require("../models/User");
const Order = require("../models/Order");

const isLoggedIn = require("../middlewares/Auth");

router.post("/add-order", [isLoggedIn], async(req, res) => {
    const {sub_total, phone} = req.body;
    const user_id = req.user._id
    try {
        const user = await User.findById(user_id).exec();
        if(!user) {
            res.status(400).json("User doesn't exist");
            return;
        }
        await Order.create({user_id, sub_total, phone})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    }
    res.json("Order Created");
});

router.get("/get-order", [isLoggedIn], async(req, res) => {
    const user_id = req.user._id
    // console.log(user_id);
    // console.log(req.user.email)
    try {
        const orders = await Order.find({user_id: user_id})
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect('/login'); // Handle authentication failure
        
        // Create a JWT token and send it to the client
        console.log(user);
        const accessToken = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn:"1d"});
        return res.json({ accessToken: "Bearer "+accessToken });
    })(req, res, next);
})

module.exports = router;