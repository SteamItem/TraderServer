import Param = require('../models/param');
import { paramEnum } from '../helpers/enum';

async function findOne(id: number) {
  return Param.default.findOne({ id });
}

async function getPeriod() {
  return await findOne(paramEnum.Period);
}

async function getCookie() {
  return await findOne(paramEnum.Cookie);
}

async function getRollbitCookie() {
  return await findOne(paramEnum.RollbitCookie);
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

async function updateCookie(cookie: string) {
  return Param.default.findOneAndUpdate({ id: paramEnum.Cookie }, { value: cookie }, {new: true});
}

async function startWorker() {
  return Param.default.findOneAndUpdate({ id: paramEnum.WorkerStatus }, { value: true }, {new: true});
}

async function stopWorker() {
  return Param.default.findOneAndUpdate({ id: paramEnum.WorkerStatus }, { value: false }, {new: true});
}

export = {
  getPeriod,
  getCookie,
  getRollbitCookie,
  getCode,
  getWorkerStatus,
  updatePeriod,
  updateCode,
  updateCookie,
  startWorker,
  stopWorker
}