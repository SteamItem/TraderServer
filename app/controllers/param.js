const Param = require('../models/param.js');
const telegram = require('../helpers/telegram');

// Retrieve and return all notes from the database.
exports.findAll = async () => {
  var params = await Param.find();
  telegram.sendMessage(JSON.stringify(params));
};

exports.update = async (id, value) => {
  var param = await Param.findOneAndUpdate({ id }, { value }, {new: true});
  telegram.sendMessage(JSON.stringify(param));
};
