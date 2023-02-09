const express = require('express');
const router = express.Router();
const User = require('../models/user');


//Register user
router.route("/")
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


    module.exports = router;