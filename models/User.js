const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');



const userSchema = new Schema({
  email: {
      type: String,

      //make sure unique email
      unique: true,

      //make sure it goes in as lower case first, saves trouble later
      lowercase: true,

      //cut out any white-space people have enterd
      trim: true,

      //to use validator we pass it an array - [how to validate, an error message]
      validate: [validator.isEmail, 'Invalid Email Address'],
      required: 'Please Supply an email address'
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
      },
    resetPasswordToken: String,
    resetPasswordExpires: Date


 });




userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

// and export it
module.exports = mongoose.model('User', userSchema);
