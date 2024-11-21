import { browser } from 'k6/browser';
import { sleep } from 'k6';

export async function waitForPageToLoad (page) {
    await page.waitForLoadState('networkidle');
    //alternative
    //await page.waitForLoadState('domcontentloaded');
}

export async function waitForElement(page, myLocator, timeoutInSec) {
    let visible = false;
    let seconds = 0;
    const element = page.locator(myLocator);
    while(!visible && seconds <= timeoutInSec) {
        if(await element.isVisible()) {
            visible = true;
            break;
        }
        sleep(1);
        seconds++;
    }
}

export async function waitForElementVisible(element, timeoutInMs) {
    try {
        await element.waitFor({
            state: 'visible',
            timeout: timeoutInMs,
        })
    } catch (error) {
        console.error('Element was not visible. ' + error);
    }
}

export async function waitForWebElement(webElement, timeoutInSec) {
    let visible = false;
    let seconds = 0;
    while(!visible && seconds <= timeoutInSec) {
        if(await webElement.isVisible()) {
            visible = true;
            break;
        }
        sleep(1);
        seconds++;
    }
    return visible;
}