const { json } = require('body-parser');
const { validationResult, check } = require('express-validator');
const moment = require('moment');
const connection = require('../app');

exports.addCompany = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        message: errors.array()[0].msg
        });
    }
    // console.log(req.body);
    // console.log(req.auth);
    const company = {};
    company.company_name = req.body.name;
    company.pan_number = req.body.panNumber;
    company.registration_no = req.body.registrationNumber;
    company.dda_no = req.body.ddaNumber;
    company.createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    console.log(req.body.role)
    connection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query('INSERT INTO companyDetails SET ?', company , function (error, results, fields) {
            // When done with the connection, release it.
            // connection.release();
            if(error){
                // console.log(err);
                return res.status(400).json({
                    message: "company details is not able saved!",
                });
            }
            // console.log(owner);
        });

        connection.query('SELECT id from companyDetails where pan_number=?', company.pan_number , function (error, results, fields) {
            if (error) throw error;
            var string=JSON.stringify(results);
            var json = JSON.parse(string);
            console.log(req.body.role)
            connection.query('UPDATE ownerProfile SET companyID = ?, role = ? WHERE id =?', [ json[0].id, req.body.role, req.auth.id], function (error, results, fields) {
                connection.release();
                if (error) throw error;
                return res.json({
                    message: "company details is saved"
                });
            });            
        });
        
    });

};

exports.getCompanyID = (req, res, next, id) => {
    connection.getConnection(function(err,connection){
        connection.query('SELECT * FROM companyDetails WHERE id=?', req.params.companyID, function (error, results, fields) {
            connection.release();
            if (error) throw error;
            var string=JSON.stringify(results);
            var company = JSON.parse(string);
            // console.log(json[0])
            if(!company.length) {
                return res.status(400).json({
                    error: "No company was found in database!",
                })
            }
            req.company = company[0];
            next();
        }); 
    }); 
};

exports.getCompany = (req,res) => {
    req.company.createdAt = undefined;  
    req.company.updatedAt = undefined; 
    return res.json(req.company);
};

exports.updateCompany  = (req,res) => {
    const company = {};
    if(req.body.name) company.company_name = req.body.name;
    if(req.body.panNumber) company.pan_number = req.body.panNumber;
    if(req.body.registrationNumber) company.registration_no = req.body.registrationNumber;
    if(req.body.ddaNumber) company.dda_no = req.body.ddaNumber;
    company.updatedAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    connection.query('UPDATE companyDetails SET ? WHERE id = ?', [company, req.company.id] , function (error, results, fields) {
        if (error) throw error;
        res.json({
            success: true,
            message: "company details is Updated!",
        });
    });
}