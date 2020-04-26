import RollbitHistory = require('../models/rollbitHistory');

async function findAll() {
    return RollbitHistory.default.find();
}

export = {
  findAll,
}