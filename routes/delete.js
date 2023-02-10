const express = require("express");
const router = express.Router();
const User = require('../models/user');
const sigUtil = require('eth-sig-util');

// delete user
router.route("/")
    .post((req, res) => {

        res.set('Access-Control-Allow-Origin', '*');

        addI = req.body.address.toLowerCase();
        sigI = req.body.signature.toLowerCase();
        const message = "Do you want to Delete your registation and data?"

        //recovering the address for validation of the signature
        const recovered = sigUtil.recoverPersonalSignature({
            data: message,
            sig: sigI
          })


        if(recovered.toLowerCase() === addI) {
     
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
        }  else {
            res.send("Invalid signature")
        } 
        console.log(JSON.stringify(req.body))
    });


module.exports = router;