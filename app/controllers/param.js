const Param = require('../models/param.js');

exports.update = async (id, value) => {
  var param = await Param.findOneAndUpdate({ id }, { value }, {new: true});
  return param;
};
