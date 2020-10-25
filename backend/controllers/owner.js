// const Owner = require("../models/owner");
const moment = require('moment');
const connection = require("../app");
const crypto = require("crypto");

exports.getOwnerById = (req, res, next, id) => {
    connection.query('SELECT * FROM ownerProfile WHERE id=?', id, function (error, results, fields) {
        if (error) throw error;
        var string=JSON.stringify(results);
        var json = JSON.parse(string);
        // console.log(json[0])
        if(!json.length) {
            return res.status(400).json({
                error: "No owner was found in database!",
            })
        }
        req.profile = json[0];
        next();
    });    
};

exports.getOwner = (req,res) => {
    req.profile.salt = undefined;
    req.profile.encryPassword = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.getAllOwners = (req,res) => {
    connection.query('SELECT * FROM ownerProfile', function (error, results, fields) {
        if (error) throw error;
        var string=JSON.stringify(results);
        var json = JSON.parse(string);
        if(!json.length) {
            return res.status(400).json({
                error: "No owner was found in database!",
            })
        }
        res.json(json);
    }); 
}

exports.updateOwner = (req,res) => {
    if(req.body.password){
        req.body.encryPassword = crypto.createHmac('sha256', owner.salt)
        .update(req.body.password)
        .digest('hex');
        req.body.password = undefined;
    }
    req.body.updatedAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    connection.query('UPDATE ownerProfile SET ? WHERE id = ?', [req.body, req.profile.id] , function (error, results, fields) {
        if (error) throw error;
        res.json({
            message: "Owner is Updated!",
        });
    });
}