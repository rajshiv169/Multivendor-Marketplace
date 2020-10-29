const express = require("express");
const router = express.Router();
const { validationResult, check } = require('express-validator');

const { addPurchase ,getPurchase, upload } = require("../controllers/purchase");
const {isSignedIn, isAuthenticated} = require("../controllers/auth")

router.post("/addPurchase", isSignedIn, upload.single("photo") ,addPurchase);

router.get("/getPurchase", isSignedIn, getPurchase);

module.exports = router;