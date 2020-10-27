const express = require("express");
const router = express.Router();
const { validationResult, check } = require('express-validator');

const { addCompany, getCompanyID ,getCompany, updateCompany } = require("../controllers/company");
// const { isSignedIn, isAuthenticated, isWholesaler, isAdmin} = require("../controllers/auth");
const {isSignedIn, isAuthenticated} = require("../controllers/auth")

router.post("/addCompany", [
    check("name", "company name should be at least 10 char").isLength({ min: 10 }),
    check("panNumber", "pan number should be at least 8 char").isLength({ min: 8 }),
    check("registrationNumber", "registration number should be at least 8 char").isLength({ min: 8 }),
    check("ddaNumber", "dda number should be at least 8 char").isLength({ min: 8 }),
], isSignedIn, addCompany);

router.get("/company", isSignedIn, getCompanyID, getCompany);
router.put("/company", isSignedIn, getCompanyID, updateCompany);


module.exports = router;