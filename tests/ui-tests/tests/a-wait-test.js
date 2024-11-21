import {browser} from 'k6/browser';
import { check } from 'https://jslib.k6.io/k6-utils/1.6.0/index.js';
import {describe, expect} from 'https://jslib.k6.io/k6chaijs/4.5.0.1/index.js';
import {sleep} from 'k6';
import {Loginpage} from '../pages/loginpage.js';
import {Homepage} from "../pages/homepage.js";
import * as wait from "../helpers/waitFor.js";
import {global, myOptions} from "../config/mainConfig.js";

export const options = myOptions;

export default async function () {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1400, height: 700 });
    const loginpage = new Loginpage(page);
    await page.goto(global.url);

    const userField = page.locator('#username');
    await wait.waitForElementVisible(userField, 12000);
    await page.screenshot({ path: 'screenshots/signIn.png' });
    // expect(await userField.isVisible(), 'username should be visible now').to.be.true;
    await check(userField, {
        'username should be visible now': async (u) => await u.isVisible() == true
    });

    await page.close();
    await browser.context().close();
}