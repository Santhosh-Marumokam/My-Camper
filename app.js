 if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
 }


const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const {campGroundSchema,reviewSchema} = require('./schemas.js')
const Campground = require('./models/campground.js');
const Review = require('./models/review');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local') ;
const User = require('./models/user.js');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
// console.log(process.env.DB_URL)
  const dbUrl = process.env.DB_URL
 //const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp'
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}
// 'mongodb://127.0.0.1:27017/yelp-camp'

app.engine('ejs',ejsMate);


// const campground = require('./models/campground.js');
const { rename } = require('fs');


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use(mongoSanitize());

app.use(mongoSanitize({
    replaceWith: '-'
}))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
    
store.on("error", function(e){
    console.log("SESSION STORE ERROR", e );
})


const sessionConfig ={ 
    store,
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.get('/',(req,res)=>{
    res.render('home')
})


app.all('*',(req,res,next)=>{
    next( new ExpressError('Page not found',404) );
})

app.use((err,req,res,next)=>{
    const {statusCode = 500, message="something went wrong"} = err ;
    if(!err.message) err.message = "something went wrong";
    if(!err.statusCode) err.statusCode = 500;
    res.status(statusCode).render('error',{err})
})

app.listen(port,()=>{
    console.log("yup I am Listening")
})

