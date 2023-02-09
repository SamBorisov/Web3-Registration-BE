const express = require("express");
const router = express.Router();
const User = require('../models/user');


// delete user
router.route("/")
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


module.exports = router;