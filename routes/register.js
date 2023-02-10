const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { check, validationResult } = require('express-validator');


        const emailCheck = check('email').isEmail();
        const ethAddressCheck = check('address').matches(/^0x[a-fA-F0-9]{40}$/);

//Register user
router.route("/")
    .get((req,res) => {
        console.log("get reg")
    })
    .post([emailCheck],[ethAddressCheck], (req, res) => {

        const errors = validationResult(req);

        res.set('Access-Control-Allow-Origin', '*');

        if (!errors.isEmpty()) {

            return res.status(400).json({ message:`Invalid ${errors.array()[0].param}` });
            
            
          } else {
            nameI =req.body.name;
            emailI = req.body.email;
            usernameI = req.body.username;
            addressI = req.body.address;
    
            User.findOne({address: addressI }, (err, result) => {
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
                    createUser.save((err) => {
                        if (err) {
                          if (err.code === 11000) {
                            const duplicateField = Object.keys(err.keyValue)[0];
                            return res.status(400).json({ message: `${duplicateField} already in use` });
                          }
                          return res.status(500).send();
                        }
                        res.send({ serverRes: "User Created" });
                        console.log("User created:", req.body);
                      });
                }
            }) 
          }

 
    });


    module.exports = router;