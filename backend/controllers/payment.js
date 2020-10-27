const { validationResult, check } = require('express-validator');
const moment = require('moment');
const connection = require('../app');

// addEstimate , addPayment

exports.addEstimate = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        error: errors.array()[0].msg
        });
    }

    if (req.role < 1) {
        return res.status(422).json({
        error: "ACCESS DENIED"
        });
    }

    const payment = {};
    payment.purchaseID = req.purchaseID;
    payment.estimated = req.estimate;
    payment.createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    connection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query('INSERT INTO paymentDetails SET ?', payment , function (error, results, fields) {
            // When done with the connection, release it.
            // connection.release();
            if(error){
                // console.log(err);
                return res.status(400).json({
                    message: "Estimate is not able to update!",
                });
            }
            // console.log(owner);
        });

        connection.query('UPDATE purchaseDetails SET status=1 WHERE id = ?', payment.purchaseID , function (error, results, fields) {
            connection.release();
            if (error) throw error;
            return res.json({
                message: "Estimate is Updated!",
            });
        });
        
    });

};

exports.addPayment = (req, res) => {
    connection.getConnection(function(err,connection){
        if (!err.isEmpty()) {
            return res.status(422).json({
            error: errors.array()[0].msg
            });
        }
    
        if (req.role > 0) {
            return res.status(422).json({
            error: "ACCESS DENIED, Buyer can only make Payment"
            });
        }
        const payment = {};
        payment.paymentID = req.PaymentID;
        payment.payment = req.payment;
        payment.createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

        connection.query('INSERT INTO payments SET ?', payment ,function(error,results, fields){
            if(error) {
                return res.status(400).json({
                    error: "Error, Payment is not made!!!",
                })
            }
            
            connection.query('UPDATE paymentDetails SET status=1 WHERE id = ?', payment.paymentID , function (error, results, fields) {
                connection.release();
                if (error) throw error;
                return res.json({
                    message: "payment is Done!",
                });
            });        
        }); 
    }); 
};

exports.getPayments = (req,res) => {
    connection.getConnection(function(err,connection){
        if (!err.isEmpty()) {
            return res.status(422).json({
            error: errors.array()[0].msg
            });
        }
       
        connection.query('SELECT * FROM payments WHERE paymentID=?', req.paymentID , function (error, results, fields) {
            connection.release();
            if(error) {
                return res.status(400).json({
                    error: "Error, Payment is not made!!!",
                })
            }

            var string=JSON.stringify(results);
            var json = JSON.parse(string);
            if(!json.length) {
                return res.status(400).json({
                    error: "No Payment is Made",
                })
            }
            return res.json(json);
            
        });

    });
};