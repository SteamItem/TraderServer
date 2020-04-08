const mongoose = require('mongoose');

const ParamSchema = mongoose.Schema({
    id: Number,
    name: String,
    value: Object
}, {
    timestamps: true
});

export = mongoose.model('Param', ParamSchema);
