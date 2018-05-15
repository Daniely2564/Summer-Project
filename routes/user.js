const router = require('express').Router();

router.route('/signup')
    .get((req,res)=>{
        res.render('main/signup');
    })
;

router.route('/signin')
    .get((req,res)=>{
        res.render('main/signin');
    })
;

module.exports = router;