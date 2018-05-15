const router = require('express').Router();

router.route('/')
    .get((req,res)=>{
        res.render('main/index');
    });

module.exports = router;