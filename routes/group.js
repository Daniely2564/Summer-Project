const router = require('express').Router();

router.route('/')
    .get((req,res)=>{
        res.render('group/index');
    })
;

module.exports = router;