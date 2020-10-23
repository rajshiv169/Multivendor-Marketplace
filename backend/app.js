const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

//Port on which the app will run
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req,res) => {
    res.json("Hello");
});

app.post("/newpost", (req,res) => {
    res.json(req.body.name);
})

app.listen(port, (err) => {
    if(err){
        console.log(err);
    } else {
        console.log("Server is Up and Running...\nLISTENING on PORT", port);
    }
})