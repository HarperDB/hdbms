import {global, myOptions} from "../config/mainConfig.js";
import {browser} from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.6.0/index.js';
import {randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.6.0/index.js';
import {describe, expect} from 'https://jslib.k6.io/k6chaijs/4.5.0.1/index.js';
import {sleep} from 'k6';

import {Loginpage} from '../pages/loginpage.js';
import {Homepage} from "../pages/homepage.js";
import {waitForElement, waitForPageToLoad} from "../helpers/waitFor.js";

export const options = myOptions;

export default async function () {
    // describe('Create Database Test', async () => {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1400, height: 700 });
    const loginpage = new Loginpage(page);
    const homepage = new Homepage(page);

    await page.goto(global.url);
    await loginpage.signIn(global.username, global.password);
    await waitForPageToLoad(page);
    const dbName = global.dbNamePrefix + randomIntBetween(1, 1000);
    await homepage.createDatabase(dbName);
    await page.screenshot({ path: 'screenshots/createDB.png' });

    await page.close();
    await browser.context().close();
}