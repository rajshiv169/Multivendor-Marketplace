// const Owner = require("../models/owner");
const moment = require('moment');
const connection = require("../app");
const crypto = require("crypto");

exports.getOwnerByToken = (req, res, next) => {
    connection.query('SELECT * FROM ownerProfile WHERE id=?', req.auth.id, function (error, results, fields) {
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
    const owner = {};
    if(owner.name)owner.name = req.body.name;
    if(owner.email)owner.email = req.body.email;
    if(owner.phone)owner.phone = req.body.phone;
    if(req.body.password){
        owner.encryPassword = crypto.createHmac('sha256', owner.salt)
        .update(req.body.password)
        .digest('hex');
        req.body.password = undefined;
    }
    owner.updatedAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    connection.query('UPDATE ownerProfile SET ? WHERE id = ?', [owner, req.profile.id] , function (error, results, fields) {
        if (error) throw error;
        res.json({
            success: true,
            message: "Owner is Updated!",
        });
    });
}