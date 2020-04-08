import Param = require('../models/param');

function findOne(id: number) {
  return Param.findOne({ id });
};

function getPeriod() {
  return findOne(paramEnum.Period);
}

function getCookie() {
  return findOne(paramEnum.Cookie);
}

function getCode() {
  return findOne(paramEnum.Code);
}

function update(id: number, value) {
  return Param.findOneAndUpdate({ id }, { value }, {new: true});
};

function updatePeriod(period: number) {
  return update(paramEnum.Period, period);
}

function updateCode(code: string) {
  return update(paramEnum.Code, code);
}

const paramEnum = {
  Period: 1,
  Cookie: 2,
  Code: 3
}

export = {
  getPeriod,
  getCookie,
  getCode,
  updatePeriod,
  updateCode
}