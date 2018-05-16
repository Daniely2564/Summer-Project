const router = require('express').Router();
const User = require('../models/user');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.route('/signup')
    .get((req,res)=>{
        res.render('main/signup');
    })
    .post((req,res)=>{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const password2 = req.body.password2;
        const name = req.body.name;
        
        req.checkBody('name','Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password2);

        const errors = req.validationErrors();

        if(errors){
            res.render('main/signup',{
                errors:errors
            });
        } else {
            let newUser = new User();
            newUser.username = username;
            newUser.email = email;
            newUser.password = password;
            newUser.name = name;
            User.uniqueUsername(newUser.username, function(err, user){
                if(err) throw err;
                if(user){
                    req.flash('message', 'The username already exists. Try different username!');
                    res.redirect('/signup');
                } else {
                    User.createUser(newUser, function(err, user){
                        if(err) return err;
                        console.log(user);
                    });
        
                    
        
                    req.flash('success','You are successfully registered! Now you can log in');
                    res.redirect('/signup');
                    
                }
            });
            
        }

    })
;

passport.use(new LocalStrategy(
    function(username, password, done){
        User.getUserByUsername(username,function(err,user){
            if(err)  throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err,isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else{
                    return done(null, false, {message:'Invalid Password'});
                }
            });
        });

        
    }
));

router.route('/signin')
    .get((req,res)=>{
        res.render('main/signin');
    })
    .post((req,res)=>{
        
    })
;

passport.serializeUser(function(user,done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.getUserById(id, function(err,user){
        done(err,user);
    });
});

module.exports = router;