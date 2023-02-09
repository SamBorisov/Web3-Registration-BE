const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require ('jsonwebtoken');


// Login user with signature
router.route("/")
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

    module.exports = router;