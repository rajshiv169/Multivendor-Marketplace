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
    // TODO: get back here for password
    return res.json(req.profile);
}