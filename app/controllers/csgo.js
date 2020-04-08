const axios = require('axios');
const Param = require('../models/param.js');
const { paramEnum } = require('../helpers/common');

exports.getToken = async () => {
  var codeParamPromise = Param.findOne({id: paramEnum.Code});
  var cookieParamPromise = Param.findOne({id: paramEnum.Cookie});
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
  var cookieParam = await Param.findOne({id: paramEnum.Cookie});
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
