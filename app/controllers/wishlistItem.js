const WishlistItem = require('../models/wishlistItem.js');

exports.create = (req, res) => {
    if(!req.body.appid) {
        return res.status(400).send({
            message: "appid can not be empty"
        });
    }
    if(!req.body.name) {
        return res.status(400).send({
            message: "name can not be empty"
        });
    }
    if(!req.body.max_price) {
        return res.status(400).send({
            message: "max_price can not be empty"
        });
    }

    const wishlistItem = new WishlistItem({
        appid: req.body.appid,
        name: req.body.name,
        max_price: req.body.max_price
    });

    wishlistItem.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Item."
        });
    });
};

exports.findAll = async () => {
    var wishlistItems = await WishlistItem.find();
    return wishlistItems;
};

exports.findOne = (req, res) => {
    WishlistItem.findById(req.params.itemId).then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        return res.status(500).send({
            message: "Error retrieving item with id " + req.params.itemId
        });
    });
};

exports.update = async (req, res) => {
    if(!req.body.appid) {
        return res.status(400).send({
            message: "appid can not be empty"
        });
    }
    if(!req.body.name) {
        return res.status(400).send({
            message: "name can not be empty"
        });
    }
    if(!req.body.max_price) {
        return res.status(400).send({
            message: "max_price can not be empty"
        });
    }

    WishlistItem.findByIdAndUpdate(req.params.itemId, {
        appid: req.body.appid,
        name: req.body.name,
        max_price: req.body.max_price
    }, {new: true}).then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        return res.status(500).send({
            message: "Error updating item with id " + req.params.itemId
        });
    });
};

exports.delete = (req, res) => {
    WishlistItem.findByIdAndRemove(req.params.itemId).then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        res.send({message: "Item deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Item not found with id " + req.params.itemId
            });
        }
        return res.status(500).send({
            message: "Could not delete item with id " + req.params.itemId
        });
    });
};
