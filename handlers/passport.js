const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy());

//now we tell passport what to do when we login
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
