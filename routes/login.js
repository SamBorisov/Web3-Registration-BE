const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require ('jsonwebtoken');
const sigUtil = require('eth-sig-util');


// Login user with signature
router.route("/")
    .post((req, res) => {

        res.set('Access-Control-Allow-Origin', '*');

        addI = req.body.address.toLowerCase();
        sigI = req.body.signature.toLowerCase();
        const message = "Do you want to Log In?"
        
        //recovering the address for validation of the signature
        const recovered = sigUtil.recoverPersonalSignature({
            data: message,
            sig: sigI
          })

        if(recovered.toLowerCase() === addI) {
     
            User.findOne({address: addI}, (err, result) => {
                if (result) {
    
                    console.log("userFound")
                    const token = jwt.sign({result}, process.env.SECRETKEY);
                    res.json({ token });                 
    
                } else if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    res.status(401).send();
                    console.log("user not found")
                }
            })
        } else {
            res.send("Invalid signature")
        }
        console.log(JSON.stringify(req.body))
    });

    module.exports = router;