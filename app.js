const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const jwt = require ('jsonwebtoken');
const session = require('express-session');
require('dotenv').config()
const port = process.env.PORT || 4000


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

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://"+process.env.USERDB+":"+process.env.PASSDB+"@socialapp.ds4zn.mongodb.net/UsersDB", { useNewUrlParser: true })

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

const userSample = new User({
    name: "Bob",
    email: "bob1@abv.bg",
    username: "coolbob1",
    address:"0x0hecuwfh4c8h2f28hccu4ruxc"
})
// userSample.save();


app.route("/")
    .get((req,res) => {
        res.send("Web 3 Registration Back End")
});

// Login 
app.route("/login")
    .post((req, res) => {

        res.set('Access-Control-Allow-Origin', '*');

        addI = req.body.address.toLowerCase();
        sigI = req.body.signature;

        if(sigI) {
     
            User.findOne({address: addI}, (err, result) => {
                if (result) {
    
                    console.log("userFound")
                    const token = jwt.sign({result}, process.env.SECRETKEY);
                    res.json({ token });

                   
    
                } else if (err) {
                    console.log(err)
                } else {
                    res.send("not found")
                    console.log("not found")
                }
            })
        }   
        console.log(JSON.stringify(req.body))
    });


//Register
app.route("/register")
    .get((req,res) => {
        console.log("get reg")
    })
    .post((req, res) => {

        res.set('Access-Control-Allow-Origin', '*');

        nameI =req.body.name;
        emailI = req.body.email;
        usernameI = req.body.username;
        addressI = req.body.address;

        User.findOne({address: addressI}, (err, result) => {
            if (result) {

                console.log("This address aleady has registration")
                res.send({serverRes: "This address aleady has registration"})
           
            } else if (err) {
                console.log(err)
                res.send(err)
            } else {

                const createUser = new User({
                    name: nameI,
                    email: emailI,
                    username: usernameI,
                    address: addressI,
                })
                createUser.save(function (err) {
                    if (err){
                        res.send({serverRes: err})
                        console.log(err);
                    } else {
                        res.send({serverRes: "User Created"})
                        console.log("User created" + JSON.stringify(req.body));
                        
                    }
                });
            }
        })  
    });

    // Profile 
app.route("/profile")
    .get((req,res) => {
        res.set('Access-Control-Allow-Origin', '*');
        try {

        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRETKEY, (err, authData) => {
            if(err) {
                res.sendStatus(403);
            
            } else {
                addI = authData.result.address.toLowerCase();
                User.findOne({address: addI}, (err, result) => {
                    if (result) {
                        req.session.user = result;
                        res.send(JSON.stringify(result));
        
                    } else if (err) {
                        console.log(err)
                    } else {
                        res.send("{}")
                        console.log("not found")
                    }
                })
            }
            });
        } catch (error) {
            console.error(error);
            res.sendStatus(500);

        }
      
    });

//logout button
app.route("/logout")
    .get((req,res) => {
        res.set('Access-Control-Allow-Origin', '*');

        req.session.destroy(function(err) {
            if (err) {
              console.log(err);
            } else {
              res.clearCookie("token");
              res.send("Logged out successfully");
              console.log("Clear");
            }
          });        
    })

// delete 
app.route("/delete")
    .post((req, res) => {

        res.set('Access-Control-Allow-Origin', '*');

        addI = req.body.address.toLowerCase();
        sigI = req.body.signature;

        if(sigI) {
     
            User.deleteOne({address: addI}, (err, result) => {
                if (result) {
    
                    console.log("user deleted")
                    res.send("User Deleted") 
    
                } else if (err) {
                    console.log(err)
                } else {
                    res.send("not found")
                    console.log("not found")
                }
            })
        }   
        console.log(JSON.stringify(req.body))
    });

//Port
app.listen(port, () => console.log(`Server is running on port ${port}.`));