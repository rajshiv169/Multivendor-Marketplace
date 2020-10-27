const express = require("express");
const router = express.Router();
const { validationResult, check } = require('express-validator');

const { addEstimate, addPayment, getPayments } = require("../controllers/purchase");
const {isSignedIn, isAuthenticated, getRole} = require("../controllers/auth")

router.post("/addEstimate", isSignedIn, getRole ,addEstimate);

router.post("/addPayment", isSignedIn, getRole ,addPayment);

router.post("/getPayments", isSignedIn, getPayments);

module.exports = router;