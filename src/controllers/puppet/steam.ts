import puppeteer = require('puppeteer');
import helpers from '../../helpers';
import { ISteamLogin } from '../../interfaces/steam';

async function login(page: puppeteer.Page, steamLogin: ISteamLogin) {
  await page.type('#steamAccountName', steamLogin.username);
  await page.type('#steamPassword', steamLogin.password);
  await page.click('#imageLogin');

  // TODO: handle
  await helpers.sleep(2000);

  await page.type('#twofactorcode_entry', steamLogin.twoFactorCode);
  await page.keyboard.press('Enter');

  // TODO: handle
  await helpers.sleep(5000);
}

export default {
  login
}