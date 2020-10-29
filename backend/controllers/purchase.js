const { validationResult, check } = require('express-validator');
const moment = require('moment');
const connection = require('../app');

// packages to upload photo
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3'); 

exports.addPurchase = (req,res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
        error: errors.array()[0].msg
        });
    }
    // console.log(req.body);
    // console.log(req.auth);
    const purchase = {};
    purchase.buyer = req.auth.id;
    purchase.saler = req.body.saler;
    purchase.photo = req.file.location;
    purchase.createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    connection.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query('INSERT INTO purchaseDetails SET ?', purchase , function (error, results, fields) {
            // When done with the connection, release it.
            // connection.release();
            if(error){
                // console.log(err);
                return res.status(400).json({
                    message: "purchase is not able to successfull!",
                });
            }
            // console.log(owner);
        });

        connection.query('SELECT id from purchaseDetails where buyer=?', purchase.buyer , function (error, results, fields) {
            if (error) throw error;
            var string=JSON.stringify(results);
            var json = JSON.parse(string);

            const orderData = {};
            orderData.ownerID = req.auth.id;
            orderData.purchaseID = json[0].id;
            orderData.createdAt = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

            connection.query('INSERT INTO orderDetails SET ?', orderData , function (error, results, fields) {
                connection.release();
                if (error) throw error;
                return res.json({
                    message: "Order is placed!"
                });
            });            
        });
        
    });

};

exports.getPurchase = (req, res) => {
    connection.getConnection(function(err,connection){
        connection.query('SELECT * FROM purchaseDetails WHERE buyer=? OR saler=?', [ req.auth.id, req.auth.id] ,function(error,results, fields){
            connection.release();
            if (error) throw error;
            var string=JSON.stringify(results);
            var json = JSON.parse(string);
            if(!json.length) {
                return res.status(400).json({
                    error: "Order is not made",
                })
            }
            return res.json(json);          
        }); 
    }); 
};

// Middlewares to upload photo
aws.config.update({
    secretAccessKey: process.env.AWSSecretKey,
    accessKeyId: process.env.AWSAccessKeyId
});

const s3 = new aws.S3();

exports.upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "multi-vendor",
        acl: "public-read",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString());
        }
    })
});