import Param = require('../models/param');

async function findOne(id: number) {
  return Param.default.findOne({ id });
}

async function getPeriod() {
  return await findOne(paramEnum.Period);
}

async function getCookie() {
  return await findOne(paramEnum.Cookie);
}

async function getCode() {
  return await findOne(paramEnum.Code);
}

async function getWorkerStatus() {
  return await findOne(paramEnum.WorkerStatus);
}

async function updatePeriod(period: number) {
  return Param.default.findOneAndUpdate({ id: paramEnum.Period }, { value: period }, {new: true});
}

async function updateCode(code: string) {
  return Param.default.findOneAndUpdate({ id: paramEnum.Code }, { value: code }, {new: true});
}

async function startWorker() {
  return Param.default.findOneAndUpdate({ id: paramEnum.WorkerStatus }, { value: true }, {new: true});
}

async function stopWorker() {
  return Param.default.findOneAndUpdate({ id: paramEnum.WorkerStatus }, { value: false }, {new: true});
}

enum paramEnum {
  Period = 1,
  Cookie = 2,
  Code = 3,
  WorkerStatus = 4
}

export = {
  getPeriod,
  getCookie,
  getCode,
  getWorkerStatus,
  updatePeriod,
  updateCode,
  startWorker,
  stopWorker
}