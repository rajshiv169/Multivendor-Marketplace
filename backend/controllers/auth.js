//const Owner = require("../models/owner")
const { validationResult, check } = require('express-validator');

// packages for token
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const moment = require('moment');
const connection = require("../app");

// package for password encryptions
const crypto = require("crypto");
const {v1: uuidv1 }= require("uuid");
  

exports.signup = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        error: errors.array()[0].msg
        });
    }

    const owner = {};
    owner.name = req.body.name;
    owner.email = req.body.email;
    // owner.encryPassword = req.body.password;
    owner.phone = req.body.phone;
    owner.salt = uuidv1();
    owner.createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    // encrypting password
    try {
        owner.encryPassword = crypto.createHmac('sha256', owner.salt)
        .update(req.body.password)
        .digest('hex');
    } catch(err){
        return res.json({
            message: err.message
        })
    }

    // checking if owner is present
    connection.query('SELECT * FROM ownerProfile WHERE email=? OR phone=?', [req.body.email, req.body.phone] , function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        var string=JSON.stringify(results);
        json = JSON.parse(string);
        if(json.length) {
            return res.status(400).json({
                message: "email or phone number already used",
            })
        }

        connection.query('INSERT INTO ownerProfile SET ?', owner, (err, fields) => {
            if(err){
                // console.log(err);
                return res.status(400).json({
                    message: "owner is not able saved!",
                });
            }
            // console.log(owner);
            res.json({
                name: owner.name,
                email: owner.email
            });
        })
    });    
}


exports.signin = (req,res) => {
    const email = req.body.email;
    const plainPassword = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        error: errors.array()[0].msg
        });
    }

    connection.query('SELECT * FROM ownerProfile WHERE email=?', email , function (error, results, fields) {
        if (error) throw error;
        // console.log(results);
        var string=JSON.stringify(results);
        json = JSON.parse(string);
        if(!json.length) {
            return res.status(400).json({
                message: "email is not in the database",
            })
        }

        try {
            password = crypto.createHmac('sha256', json[0].salt)
            .update(plainPassword)
            .digest('hex');
        } catch(err){
            return res.json({
                message: err.message
            })
        }

        if(password === json[0].encryPassword){
            // create a token for token based login
            const token = jwt.sign({ id: json[0].id}, process.env.SECRET);

            //put token in cookie
            res.cookie("token",token, {expire: 86400});

            //response to frontend
            return res.json({
                token: token,
                owner: { 
                    id: json[0].id,
                    name: json[0].name,
                    email: json[0].email,
                    role: json[0].role
                }
            });
        } else {
            return res.status(401).json({
                message: "password not matched"
            })
        }

    });
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

// TODO: this things are to be integrated

// //custom middlewares
// exports.isAuthenticated = (req,res,next) => {
//     let checker = req.profile && req.auth && req.profile._id == req.auth._id;
//     if(!checker){
//         return res.status(403).json({
//             error: "ACCESS DENIED"
//         });
//     }
//     next();
// };

// exports.isWholesaler = (req,res,next) => {
//     if(req.profile.role === 0){
//         return res.status(403).json({
//             error: "You're not Wholesaler, Access denied"
//         });
//     }
//     next();
// }

// // For future aspects : this will helps to authenticate admin for the whole site
// exports.isAdmin = (req,res,next) => {
//     if(req.profile.role <= 1){
//         return res.status(403).json({
//             error: "You're not Admin, Access denied"
//         });
//     }
//     next();
// }