import axios from 'axios';
import paramController = require('./param');

async function getToken() {
  var codeParamPromise = paramController.getCode();
  var cookieParamPromise = paramController.getCookie();
  var promiseResults = await Promise.all([codeParamPromise, cookieParamPromise]);
  var codeParam = promiseResults[0];
  var cookieParam = promiseResults[1];

  if (!codeParam) throw new Error("Code not found.");
  if (!cookieParam) throw new Error("Cookie not found.");

  let data = JSON.stringify({
    "code": codeParam.value,
    "uuid": "1"
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
  var cookieParam = await paramController.getCookie();
  if (!cookieParam) throw new Error("Cookie not found.");
  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieParam.value,
      'Host': 'csgoempire.gg'
    }
  };
  var result = await axios.get('https://csgoempire.gg/api/v2/user', content);
  return result.data;
}

export = {
  getToken,
  profile
}