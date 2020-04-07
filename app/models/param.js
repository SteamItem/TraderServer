const mongoose = require('mongoose');

const ParamSchema = mongoose.Schema({
    id: Number,
    name: String,
    value: Object
}, {
    timestamps: true
});

module.exports = mongoose.model('Param', ParamSchema);
