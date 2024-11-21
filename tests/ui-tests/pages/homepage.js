import {waitForElement, waitForWebElement} from "../helpers/waitFor.js";
import { sleep } from 'k6';
import { check } from 'https://jslib.k6.io/k6-utils/1.6.0/index.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.6.0/index.js';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.5.0.1/index.js';
import {verifyElementTextInList} from "../helpers/verifyElements.js";

export class Homepage {
    constructor(page) {
        this.page = page;
        this.databaseContainer = 'div.entity-manager:first-child';
        this.menu = page.locator('#app-container nav');
        this.createDb = page.locator('[id="toggleCreate"][title="Add database"]');
        this.inputDbName = page.locator(this.databaseContainer + ' #name');
        this.createDbCheckButton = page.locator(this.databaseContainer + ' #createItem');
        this.databasesSelector = this.databaseContainer + ' [class*="item-row"]';

    }

    async isMenuVisible() {
        return await waitForWebElement(this.menu, 10);
        // return await this.menu.isVisible();
    }

    async createDatabase(dbName) {
        await this.createDb.click();
        await this.inputDbName.type(dbName);
        await this.createDbCheckButton.click();
        sleep(2);
        const dbs = await this.page.$$(this.databasesSelector);
        const found = await verifyElementTextInList(dbName, dbs);
        // expect(found, 'New db name should exist').to.be.true;
        await check(found, {
            'New db name should exist': async (found) => await found == true
        });
    }
}