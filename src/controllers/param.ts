import Param = require('../models/param');

async function findOne(id) {
  var param = await Param.findOne({ id });
  return param;
};

async function update(id, value) {
  var param = await Param.findOneAndUpdate({ id }, { value }, {new: true});
  return param;
};

export = {
  findOne,
  update
}