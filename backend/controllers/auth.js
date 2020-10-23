const Owner = require("../models/owner")
const { validationResult, check } = require('express-validator');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        error: errors.array()[0].msg
        });
    }

    const owner = new Owner(req.body);
    owner.save((err, owner) => {
        if(err){
            return res.status(400).json({
                message: "owner is not able saved!",
            });
        }
        res.json({
            name: owner.name,
            email: owner.email,
            id: owner._id
        });
    });
};

exports.signin = (req,res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        error: errors.array()[0].msg
        });
    }

    Owner.findOne({email}, (err,owner) => {
        if(err || !owner){
            return res.status(400).json({
                error: "Owner does not exists"
            })
        }

        if(!owner.authenticate(password)){
            return res.status(401).json({
                error: "Email and Password do not match"
            })
        }

        // create a token for token based login
        const token = jwt.sign({_id: owner._id}, process.env.SECRET);

        //put token in cookie
        res.cookie("token",token, {expire: 86400});

        //response to frontend
        const {_id, name, email, role} = owner;
        return res.json({
            token: "bearer " + token,
            owner: { _id, name, email, role}
        });
    })
}

exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message: "user signout successfully"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
});

//custom middlewares
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

exports.isWholesaler = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You're not Wholesaler, Access denied"
        });
    }
    next();
}

// For future aspects : this will helps to authenticate admin for the whole site
exports.isAdmin = (req,res,next) => {
    if(req.profile.role <= 1){
        return res.status(403).json({
            error: "You're not Admin, Access denied"
        });
    }
    next();
}