const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
dotenv.config();

// Database Connections
mongoose.connect(process.env.DATABASE, 
 { useNewUrlParser: true, useUnifiedTopology: true },
 (err) => {
    if(err){
        console.log(err);
    }else {
        console.log("Connected to the Database");
    }
})

//Port on which the app will run
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Import Routes
const authRoutes = require("./routes/auth");
const ownerRoutes = require("./routes/owner")

//Routes
app.use("/api", authRoutes);
app.use("/api", ownerRoutes);

app.listen(port, (err) => {
    if(err){
        console.log(err);
    } else {
        console.log("Server is Up and Running...\nLISTENING on PORT", port);
    }
})