const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const userSchema = new Schema({
    name:String,
    password:String,
    username:String
});

const User = module.exports = mongoose.model('User', userSchema);

 