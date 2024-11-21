import { browser } from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.6.0/index.js';
import {describe, expect} from 'https://jslib.k6.io/k6chaijs/4.5.0.1/index.js';
import {sleep} from 'k6';
import {Loginpage} from '../pages/loginpage.js';
import {Homepage} from "../pages/homepage.js";
import {waitForElement, waitForPageToLoad} from "../helpers/waitFor.js";
import {global, myOptions} from "../config/mainConfig.js";

export const options = myOptions;

export default async function () {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1400, height: 700 });
    const loginpage = new Loginpage(page);
    const homepage = new Homepage(page);

    await page.goto(global.url);
    await loginpage.signIn(global.username, global.password);
    await waitForPageToLoad(page);
    await page.screenshot({ path: 'screenshots/login.png' });
    // expect() terminates the test run. use check() instead. if needed, add a threshold for checks in myOptions
    // expect(await homepage.isMenuVisible()).to.be.true;
    await check(homepage, {
        'homepage menu should be visible': async (h) => await h.isMenuVisible() == true
    });

    await page.close();
    await browser.context().close();
}