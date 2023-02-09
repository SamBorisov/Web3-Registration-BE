const express = require('express');
const router = express.Router();



//logout button
router.route("/")
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



module.exports = router;