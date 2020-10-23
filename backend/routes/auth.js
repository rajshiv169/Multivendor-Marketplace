const express = require('express');
const router = express.Router();
const Owner = require("../models/owner")
const { validationResult, check } = require('express-validator');
const {signout, signup, signin, isSignedIn} = require("../controllers/auth");

router.post("/signup", [
    check("name", "name should be at least 5 char").isLength({ min: 5 }),
    check("email", "email is required").isEmail(),
    check("password", "password should be at least 5 char").isLength({ min: 5 })
], signup);

router.post("/signin", [
    check("email", "email is required").isEmail(),
    check("password", "password is require").isLength({ min: 1 })
], signin);

router.get("/signout", signout);


// router.get("/testroute", isSignedIn, (req,res) => {
//     res.json({
//         auth: req.auth
//     });
// })

module.exports = router;