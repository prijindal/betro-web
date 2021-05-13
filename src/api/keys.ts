import { symDecrypt } from "betro-js-lib";
import AuthController from "./auth";

class KeysController {
    auth: AuthController;
    constructor(auth: AuthController) {
        this.auth = auth;
    }

    fetchKeys = async (): Promise<boolean> => {
        if (!this.auth.isAuthenticated()) return false;
        const response = await this.auth.instance.get("api/keys");
        const data = response.data;
        const encryptedPrivateKey = data.private_key;
        const encryptedSymKey = data.sym_key;
        const privateKey = await symDecrypt(this.auth.encryptionKey, encryptedPrivateKey);
        if (privateKey != null) {
            const private_key = privateKey.toString("base64");
            let sym_key: string | undefined;
            const symKey = await symDecrypt(this.auth.encryptionKey, encryptedSymKey);
            if (symKey != null) {
                sym_key = symKey.toString("base64");
                this.auth.privateKey = private_key;
                this.auth.symKey = sym_key;
                return true;
            }
        }
        return false;
    };
}

export default KeysController;
