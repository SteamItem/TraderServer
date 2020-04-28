import axios from 'axios';
import paramController = require('./botParam');
import { botEnum } from '../helpers/enum';

async function getToken(id: botEnum) {
  var botParam = await paramController.getBotParam(id);
  if (!botParam) throw new Error("BotParam not found");

  let data = JSON.stringify({
    "code": botParam.code,
    "uuid": "1"
  });

  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': botParam.cookie,
      'Host': 'csgoempire.gg'
    }
  };
  var result = await axios.post('https://csgoempire.gg/api/v2/user/security/token', data, content);
  return result.data;
}

async function profile(id: botEnum) {
  var cookie = await paramController.getCookie(id);
  if (!cookie) throw new Error("Cookie not found.");
  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
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