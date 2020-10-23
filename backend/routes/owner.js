const express = require("express");
const router = express.Router();

const { getOwnerById, getOwner, getAllOwners, updateOwner } = require("../controllers/owner");
const { isSignedIn, isAuthenticated, isWholesaler, isAdmin} = require("../controllers/auth");

router.param("ownerId",getOwnerById);

router.get("/owner/:ownerId", isSignedIn, isAuthenticated, getOwner);
router.put("/owner/:ownerId", isSignedIn, isAuthenticated, updateOwner);

// list of all owners
router.get("/owners", isAuthenticated, isAdmin, getAllOwners)

module.exports = router;