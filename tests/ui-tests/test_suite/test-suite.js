import {global, myOptions} from "../config/mainConfig.js";
import {browser} from 'k6/browser';
import {randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.6.0/index.js';
import {describe, expect} from 'https://jslib.k6.io/k6chaijs/4.5.0.1/index.js';
import {sleep} from 'k6';

import {Loginpage} from '../pages/loginpage.js';
import {Homepage} from "../pages/homepage.js";
import {waitForElement, waitForPageToLoad} from "../helpers/waitFor.js";
import loginTest from "../tests/login-test.js";
import waitTest from "../tests/a-wait-test.js";
import createDatabaseTest from "../tests/create-database-test.js";


export const options = myOptions;

export function setup() {
    console.log('before test');
}

export function teardown() {
    console.log('after test');
}

export default async function () {
    await waitTest();
    await loginTest();
    await createDatabaseTest();

//  HOW TO RUN:

//  K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html K6_BROWSER_HEADLESS=false k6 run test_suite/test-suite.js

//  K6_BROWSER_HEADLESS=false k6 run test_suite/test-suite.js
//  -e HDB_URL=http://localhost:9925
//  -e HDB_USERNAME='admin' -e HDB_PASSWORD='admin'

// K6_BROWSER_HEADLESS=false k6 run test_suite/test-suite.js
}