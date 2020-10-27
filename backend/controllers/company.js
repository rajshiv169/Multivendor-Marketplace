const { json } = require('body-parser');
const { validationResult, check } = require('express-validator');
const moment = require('moment');
const connection = require('../app');

exports.addCompany = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        error: errors.array()[0].msg
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

            connection.query('UPDATE ownerProfile SET companyID = ? WHERE id =?', [ json[0].id, req.auth.id], function (error, results, fields) {
                connection.release();
                if (error) throw error;
                return res.json({
                    message: "company details is saved"
                });
            });            
        });
        
    });

};

exports.getCompanyID = (req, res, next) => {
    connection.getConnection(function(err,connection){
        connection.query('SELECT CompanyID FROM ownerProfile WHERE id=?', req.auth.id, function(error,results, fields){
            connection.release();
            if (error) throw error;
            var string=JSON.stringify(results);
            var json = JSON.parse(string);
            if(!json.length) {
                return res.status(400).json({
                    error: "please create company details",
                })
            }
            req.companyID = json[0].CompanyID   
            next();          
        }); 
    }); 
};

exports.getCompany = (req,res) => {
    connection.getConnection(function(err,connection){
        connection.query('SELECT * FROM companyDetails WHERE id=?', req.companyID, function (error, results, fields) {
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
            company[0].createdAt = undefined;  
            company[0].updatedAt = undefined; 
            return res.json(company[0]);     
        }); 
    });
};

exports.updateCompany  = (req,res) => {
    const company = {};
    if(req.body.name) company.company_name = req.body.name;
    if(req.body.panNumber) company.pan_number = req.body.panNumber;
    if(req.body.registrationNumber) company.registration_no = req.body.registrationNumber;
    if(req.body.ddaNumber) company.dda_no = req.body.ddaNumber;
    company.updatedAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    connection.query('UPDATE companyDetails SET ? WHERE id = ?', [company, req.companyID] , function (error, results, fields) {
        if (error) throw error;
        res.json({
            message: "company details is Updated!",
        });
    });
}