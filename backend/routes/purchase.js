const express = require("express");
const router = express.Router();
const { validationResult, check } = require('express-validator');

const { addPurchase ,getPurchase } = require("../controllers/purchase");
const {isSignedIn, isAuthenticated} = require("../controllers/auth")

router.post("/addPurchase", isSignedIn, addPurchase);

router.get("/getPurchase", isSignedIn, getPurchase);

module.exports = router;