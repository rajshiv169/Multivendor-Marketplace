const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
// const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Database Connection libraries
const mysql = require('mysql');

const app = express();
dotenv.config();

// Database Connections
// mongoose.connect(process.env.DATABASE, 
//  { useNewUrlParser: true, useUnifiedTopology: true },
//  (err) => {
//     if(err){
//         console.log(err);
//     }else {
//         console.log("Connected to the Database");
//     }
// })

//mysql connection
const connection = mysql.createPool({
  connectionLimit : 10,
  host: process.env.HOST,
  user: process.env.MYSQLUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

connection.getConnection((err,con) => {
    if(con) {
        console.log('Connected to the MYSQL Database');
    } else {
        console.log(err);
    }
});
// connection.connect((err) => {
//   if(!err)
//     console.log('Connected to the MYSQL Database');
//   else
//     console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
// });

module.exports = connection;

//Port on which the app will run
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

//Import Routes
const authRoutes = require("./routes/auth");
const ownerRoutes = require("./routes/owner");
const companyRoutes = require("./routes/company");
const purchaseRoutes = require("./routes/purchase");

//Routes
app.use("/api", authRoutes);
app.use("/api", ownerRoutes);
app.use("/api", companyRoutes);
app.use("/api", purchaseRoutes);

app.listen(port, (err) => {
    if(err){
        console.log(err);
    } else {
        console.log("Server is Up and Running...\nLISTENING on PORT", port);
    }
})