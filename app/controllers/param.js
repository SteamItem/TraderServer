const Param = require('../models/param');

exports.findOne = async (id) => {
  var param = await Param.findOne({ id });
  return param;
};

exports.update = async (id, value) => {
  var param = await Param.findOneAndUpdate({ id }, { value }, {new: true});
  return param;
};
