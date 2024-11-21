export class Loginpage {
    constructor(page) {
        this.page = page;
        this.username = page.locator('#username');
        this.password = page.locator('#password');
        this.signInButton = page.locator('[id="signIn"][type="button"]');
    }

    async signIn(user, pass) {
        await this.username.type(user);
        await this.password.type(pass);
        await this.signInButton.click();
    }
}