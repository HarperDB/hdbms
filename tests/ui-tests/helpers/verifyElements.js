import { expect } from 'https://jslib.k6.io/k6chaijs/4.5.0.1/index.js';
import { check, fail } from 'k6';

export async function verifyElementTextInList(myText, listOfWebElements) {
    let found = false;
    check(listOfWebElements, {
        'list was not empty': (listOfWebElements) => listOfWebElements.length > 0,
    })
    // expect(listOfWebElements, 'list should not be empty').to.not.be.empty;
    for(const el of listOfWebElements) {
        const text = await el.innerText();
        if(text === myText) {
            found = true;
            break;
        }
    }
    return found;
}