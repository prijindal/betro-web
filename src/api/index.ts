class AuthController {
    public login() {}
}

class BetroApi {
    public auth: AuthController;
    constructor() {
        this.auth = new AuthController();
    }
}

export default BetroApi;
