const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(cors({origin: true, credentials: true}));
app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});  
app.use(passport.initialize());
passport.use(
    new GoogleStrategy(
        {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8000/user/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
        // This callback will be invoked after successful Google Sign-In
        // You can save the user's information or perform custom logic here
        return done(null, profile);
        }
    )
);

const userRoutes = require('./routes/User');
const orderRoutes = require('./routes/Order')

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to Database"))
.catch((err) => console.log(err));

app.use(express.json());
app.use('/user', userRoutes);
app.use('/order', orderRoutes);

app.listen(process.env.PORT, ()=> {
    console.log(`Server started on Port ${process.env.PORT}`)
})