import axios from 'axios';
import paramController = require('./param');
import common = require('../helpers/common');

async function getToken() {
  var codeParamPromise = paramController.findOne(common.paramEnum.Code);
  var cookieParamPromise = paramController.findOne(common.paramEnum.Cookie);
  var promiseResults = await Promise.all([codeParamPromise, cookieParamPromise]);
  var codeParam = promiseResults[0];
  var cookieParam = promiseResults[1];

  let data = JSON.stringify({
    "code": codeParam.value
  });

  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieParam.value,
      'Host': 'csgoempire.gg'
    }
  };
  var result = await axios.post('https://csgoempire.gg/api/v2/user/security/token', data, content);
  return result.data;
}

async function profile() {
  var cookieParam = await paramController.findOne(common.paramEnum.Cookie);
  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieParam.value,
      'Host': 'csgoempire.gg'
    }
  };
  var result = await axios.get('https://csgoempire.gg/api/v2/user', content);
  return result.data;
};

export = {
  getToken,
  profile
}