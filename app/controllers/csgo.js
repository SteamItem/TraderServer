const axios = require('axios');
const paramController = require('./param');
const { paramEnum } = require('../helpers/common');

exports.getToken = async () => {
  var codeParamPromise = paramController.findOne(paramEnum.Code);
  var cookieParamPromise = paramController.findOne(paramEnum.Cookie);
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

exports.profile = async () => {
  var cookieParam = await paramController.findOne(paramEnum.Cookie);
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
