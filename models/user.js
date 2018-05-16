const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name:String,
    password:String,
    username:{
        type:String,
        index:true
    },
    email:String,
    rank:{
        type:Number,
        default:1
    }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err,hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback){
    let query = {username:username};
    User.findOne(query,callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword,hash,function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
};

module.exports.getuserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.uniqueUsername = function(username,callback){
    let query = {username:username};
    User.findOne(query,callback);
}