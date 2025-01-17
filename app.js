const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = 8080;

const MONGO_URL = process.env.MONGO_URL;
// const dbUrl = process.env.ATLASDB_URL;
async function main() {
    mongoose.connect(MONGO_URL);
}

main()
    .then((res)=>console.log("connected to db"))
    .catch((err)=>{console.error(err)});

app.use(express.json());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static("public"));

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err)
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(req.user);
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = {
//         email: "dinesh@gmail.com",
//         username: "dinesh kumar singh",
//     };

//     let newUser = await User.register(fakeUser, "helloworld");
//     console.log(newUser.hash);
//     res.send(newUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 12000,
//         location:"Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();

//     console.log("sample was saved");
//     res.send("successful testing");
// });

// index Route


app.all("*", (req,res,next)=>{  // "*" --> means all routes
    next(new ExpressError(404, "Page not found"));
});
// error handling
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "something went wrong"} = err;
    // res.send("something went wrong");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs", {message});
});


app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`);
});