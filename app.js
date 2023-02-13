const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const session = require('express-session');
require('dotenv').config()
const port = process.env.PORT || 4000


//Importing routs 
const deleteRoute = require('./routes/delete');
const logoutRoute = require('./routes/logout');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const profileRoute = require('./routes/profile');


//Setting up server
const corsOptions = {
    hostname: 'https://web3-registration-fe.pages.dev/',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, PUT, POST"
}
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(cors(corsOptions))
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: true,
}));

//Mongoose connection
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://"+process.env.USERDB+":"+process.env.PASSDB+"@socialapp.ds4zn.mongodb.net/UsersDB", { useNewUrlParser: true })



app.route("/")
    .get((req,res) => {
        res.send("Web 3 Registration Back End")
});

//Routs

app.use("/login" ,loginRoute)

app.use("/register" ,registerRoute)

app.use("/profile" ,profileRoute)

app.use("/logout" ,logoutRoute)

app.use("/delete" ,deleteRoute)


//Port
app.listen(port, () => console.log(`Server is running on port ${port}.`));