const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

//Setting up server
const corsOptions = {
    origin: 'http://localhost:3000',
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

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/UsersDB", { useNewUrlParser: true })

//schemas
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a your name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Username Taken"],
    },
    address: {
        type: String,
        required: [true, "Please provide an address"],
        unique: [true, "Address linked to another account"],
    },
})


const User = mongoose.model("User", userSchema);

//variables

let Logged = true;

const userSample = new User({
    name: "Bob",
    email: "bob1@abv.bg",
    username: "coolbob1",
    address: "hjhd81hd9jd19j1jd1w9jdk0w1dj"
})
// userSample.save();


//index page
app.get('/', function (req, res) {

    //res.send({ message: "Hello from server!" + Logged })
    res.send(Logged)

});


// Login 
app.route("/login")
    .post((req, res) => {

        res.set('Access-Control-Allow-Origin', '*');

        usernameI = req.body.username;
        addressI = req.body.address;

        User.findOne({username: usernameI, address: addressI}, (err, result) => {
            if (result) {
                console.log("userFound")
                Logged = true;
                console.log(Logged)
            } else if (err) {
                console.log(err)
            } else {
                res.send("not found")
            }

        })

        console.log(JSON.stringify(req.body))
    });


//Register
app.route("/register")
    .get((req,res) => {
        return Logged;
    })
    .post((req, res) => {

        res.set('Access-Control-Allow-Origin', '*');


        nameI =req.body.name;
        emailI = req.body.email;
        usernameI = req.body.username;
        addressI = req.body.address;

        const createUser = new User({
            name: nameI,
            email: emailI,
            username: usernameI,
            address: addressI
        })
        createUser.save();

        console.log("User created" + JSON.stringify(req.body));

    });


//Logout
app.route("/logout")
    .get((req,res) => {

        Logged = false;
        console.log(Logged)

    });


//Port
app.listen(4000, () => console.log(`Server is running on port 4000.`));