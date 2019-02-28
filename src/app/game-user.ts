export class GameUser {
    private username: string = null;

    constructor(username: string) {
        this.username = username;
    }

    getUsername(): string {
        return this.username;
    }
}
