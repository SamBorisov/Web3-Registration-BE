const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Setting up server
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/UsersDB", { useNewUrlParser: true })

//schemas
const userSchema = new mongoose.Schema ({
    name:  {
        type: String,
        required: [true, "Please provide a your name!"],
      },
    email:  {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
      },
    username:  {
        type: String,
        required: [true, "Please provide a username"],
        unique: [true, "Username Taken"],
      },
        address:  {
        type: String,
        required: [true, "Please provide an address"],
        unique: [true, "Address linked to another account"],
      },
  })


const User = mongoose.model("User", userSchema);

//variables

let Logged = false;

const userSample = new User({
    name: "Bob",
    email: "bob1@abv.bg",
    username: "coolbob1",
    address: "hjhd81hd9jd19j1jd1w9jdk0w1dj"
  })
 // userSample.save();


// index page
app.get('/', function(req, res) {

    res.send({ message: "Hello from server!"  + Logged})
    
});


// Login & Register
app.route("/login")
    .get(function(req, res) {

        User.find({}, (err, result) => {
           res.send(result);
        })
        
    })
    .post((req,res)=>{

        console.log(req.body.email)

        nameI = req.body.name;
        emailI = req.body.email;
        usernameI = req.body.username;
        addressI = req.body.address;

        User.findOne({name: nameI, email: emailI, username: usernameI, address: addressI}, (err, result) => {
            if (result) {
                console.log("userFound")
                res.send(result)
                Logged = true;
            } else if (err) {
                console.log(err)
            } else {
                res.send("not found")
            }

            })
    });



app.route("/register")
    .post((req,res)=>{

        console.log(req.body);
        console.log(JSON.stringify(req.body));

        nameI = req.body.name;
        emailI = req.body.email;
        usernameI = req.body.username;
        addressI = req.body.address;

        const createUser = new User({
            name: nameI,
            email: emailI,
            username: usernameI,
            address: addressI
          })
        //createUser.save();

        res.redirect('/login')
    });





    //Port
app.listen(3001, () => console.log(`Server is running on port 3001.`));