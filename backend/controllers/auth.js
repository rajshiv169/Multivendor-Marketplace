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
            return res.json({
                message: "email or phone number already used",
                error: "1"
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
            const token = jwt.sign(owner, process.env.SECRET,{
                expiresIn: 604800 // 1 week
            });

            res.json({
                token: token,
                message: "successfully created a new user"
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
            const token = jwt.sign({ id: json[0].id}, process.env.SECRET,{
                expiresIn: 604800 // 1 week
            });

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

//custom middlewares
exports.isAuthenticated = (req,res,next) => {
    console.log(req.profile)
    let checker = req.profile && req.auth && req.profile.id == req.auth.id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

// for role
exports.getRole = (req,res,next) => {
    connection.getConnection(function(err,connection){
        connection.query('SELECT role FROM ownerProfile WHERE id=?', req.auth.id ,function(error,results, fields){
            connection.release();
            if (error) throw error;
            var string=JSON.stringify(results);
            var json = JSON.parse(string);
            req.role = json[0].role;
            next();        
        }); 
    });
};

// For future aspects : this will helps to authenticate admin for the whole site
// TODO: resolve the error: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
//       after api calling @ api/owners

exports.isAdmin = (req,res,next) => {
    connection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query('SELECT * FROM ownerProfile WHERE id=?', req.auth.id , function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();
            if (error) throw error;
            var string=JSON.stringify(results);
            json = JSON.parse(string);
            if(json[0].role <= 1){
                return res.status(403).json({
                    error: "You're not Admin, Access denied"
                });
            }
        });
        
      });
      
    next();
};

// TO DO: 
// exports.isWholesaler = (req,res,next) => {
//     if(req.profile.role === 0){
//         return res.status(403).json({
//             error: "You're not Wholesaler, Access denied"
//         });
//     }
//     next();
// }