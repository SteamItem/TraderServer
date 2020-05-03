import axios from 'axios';
import { IEmpireProfile } from '../interfaces/profile';

async function getToken(code: string, cookie: string) {
  let data = JSON.stringify({
    "code": code,
    "uuid": "1"
  });

  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
      'Host': 'csgoempire.gg'
    }
  };
  var result = await axios.post('https://csgoempire.gg/api/v2/user/security/token', data, content);
  return result.data;
}

async function profile(cookie: string) {
  let content = {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
      'Host': 'csgoempire.gg'
    }
  };
  var result = await axios.get<IEmpireProfile>('https://csgoempire.gg/api/v2/user', content);
  return result.data;
}

export = {
  getToken,
  profile
}