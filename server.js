const express = require('express');
const validator = require('express-validator');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config/config');

mongoose.Promise = global.Promise;

mongoose.connect(config.mlab)
    .then(()=>{
        console.log(`Successfully connected to mongo db`);
    })
    .catch((err)=>{
        console.log(`Failed to connect to mongodb.. `);
        console.log(err);
    })
;


const app = express();

//template
app.engine('hbs', hbs({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir: __dirname+'/views/layouts',
    partialsDir: __dirname+'/views/partials'
}));
app.set('view engine', 'hbs');

// directory
app.use('/css', express.static(__dirname+'/public/css'));
app.use('js', express.static(__dirname+'/public/js'));
app.use('img', express.static(__dirname+'/public/img'));

// middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(flash());

app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(validator({
    errorFormatter:function(param,message,value){
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + `]`;
        }

        return {
            param : formParam,
            message : message,
            value : value
        }
    }
}));
``
app.use(function(req,res,next){
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.message = req.flash('message');
    res.locals.user = req.user || null;
    next();
});


// routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
app.use('/',indexRouter);
app.use('/',userRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, (err)=>{
    if(err) return console.log(err);
    console.log(`The app is running on ${ PORT }`);
});