import puppeteer = require('puppeteer');
import helpers from '../../helpers';
import steam from './steam';
import { ISteamLogin } from '../../interfaces/steam';

async function login(steamLogin: ISteamLogin) {
  const browser = await puppeteer.launch();
  const mainPage = await browser.newPage();
  await mainPage.goto('https://csgoempire.gg');
  await mainPage.click('.user-action');

  // TODO: handle
  await helpers.sleep(2000);

  var postPages = await browser.pages();
  var steamLoginPage = postPages[postPages.length - 1];

  await steam.login(steamLoginPage, steamLogin);

  const cookies = await mainPage.cookies();

  await browser.close();
  return cookies;
}

export default {
  login
}