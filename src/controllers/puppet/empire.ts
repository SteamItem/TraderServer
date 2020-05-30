import puppeteer = require('puppeteer');
import helpers from '../../helpers';
import steam from './steam';
import { ISteamLogin } from '../../interfaces/steam';
import { Constants } from '../../helpers/constant';

async function login(steamLogin: ISteamLogin) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  try {
    const mainPage = await browser.newPage();
    mainPage.setUserAgent(Constants.EmpireUserAgent);
    await mainPage.goto('https://csgoempire.gg');
    await mainPage.click('.user-action');

    // TODO: handle
    await helpers.sleep(2000);

    var postPages = await browser.pages();
    var steamLoginPage = postPages[postPages.length - 1];
    steamLoginPage.setUserAgent(Constants.EmpireUserAgent);

    await steam.login(steamLoginPage, steamLogin);

    const cookies = await mainPage.cookies();

    return cookies;
  } finally {
    await browser.close();
  }
}

export default {
  login
}