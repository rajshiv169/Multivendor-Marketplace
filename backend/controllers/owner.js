const Owner = require("../models/owner");

exports.getOwnerById = (req, res, next, id) => {
    Owner.findById(id).exec((err, owner) => {
        if(err || !owner){
            return res.status(400).json({
                error: "No owner was found in database!"
            })
        }

        req.profile = owner;
        next();
    });
};

exports.getOwner = (req,res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
}

exports.getAllOwners = (req,res) => {
    Owner.find().exec((err, owners) => {
        if( err || !owners ){
            return res.status(400).json({
                error: "No owner found"
            })
        }
        res.json(owners)
    })
}

exports.updateOwner = (req,res) => {
    Owner.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err,owner) => {
            if(err){
                return res.status(400).json({
                    error: "You are not authorized to update"
                })
            }
            owner.salt = undefined;
            owner.encry_password = undefined;

            res.json(owner);
        }
    )
}