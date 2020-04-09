import Param = require('../models/param');

async function findOne(id: number) {
  return Param.default.findOne({ id });
}

async function getPeriod() {
  return findOne(paramEnum.Period);
}

async function getCookie() {
  return findOne(paramEnum.Cookie);
}

async function getCode() {
  return findOne(paramEnum.Code);
}

async function updatePeriod(period: number) {
  return Param.default.findOneAndUpdate({ id: paramEnum.Period }, { period }, {new: true});
}

async function updateCode(code: string) {
  return Param.default.findOneAndUpdate({ id: paramEnum.Code }, { code }, {new: true});
}

enum paramEnum {
  Period = 1,
  Cookie = 2,
  Code = 3
}

export = {
  getPeriod,
  getCookie,
  getCode,
  updatePeriod,
  updateCode
}