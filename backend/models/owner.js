const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require("crypto");
const {v1: uuidv1 }= require("uuid");

const ownerSchema = new Schema({
    name : {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    ownerDetails: {
        type: Schema.Types.ObjectId,
    },
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, {timestamps: true});

ownerSchema.virtual("password")
    .set(function(password){
        this._password = password; // the "_" before password is for creating a private variable
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this._password;
    })

ownerSchema.methods = {
    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password;
    },
    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        } catch(err){
            return "";
        }
    }
}

module.exports = mongoose.model("Owner",ownerSchema);