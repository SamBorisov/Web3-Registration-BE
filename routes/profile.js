const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require ('jsonwebtoken');


 // Profile page
 router.route("/")
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


module.exports = router;