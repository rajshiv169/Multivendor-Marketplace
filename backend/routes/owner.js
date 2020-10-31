const express = require("express");
const router = express.Router();

const { getOwnerByToken, getOwner, getAllOwners, updateOwner } = require("../controllers/owner");
const { isSignedIn, isAuthenticated, isWholesaler, isAdmin} = require("../controllers/auth");

// router.param("ownerId",getOwnerByToken);

router.get("/owner", isSignedIn, getOwnerByToken, getOwner);
router.put("/owner", isSignedIn, getOwnerByToken, isAuthenticated, updateOwner);

// list of all owners
router.get("/owners",isSignedIn, isAdmin, getAllOwners)

module.exports = router;