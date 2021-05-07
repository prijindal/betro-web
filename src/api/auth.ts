import axios, { AxiosInstance } from "axios";
import {
    aesEncrypt,
    generateRsaPair,
    generateSymKey,
    getEncryptionKey,
    getMasterHash,
    getMasterKey,
} from "betro-js-lib";

class AuthController {
    private host: string;
    public encryptionKey = "";
    public encryptionMac = "";
    private token = "";
    public privateKey = "";
    public symKey = "";
    public instance: AxiosInstance;
    constructor(host: string) {
        this.host = host;
        this.instance = axios.create({ baseURL: host });
    }

    isAuthenticated = (): boolean => {
        if (
            this.encryptionKey.length === 0 ||
            this.encryptionMac.length === 0 ||
            this.token.length === 0
        ) {
            return false;
        }
        return true;
    };

    storeLocal = () => {
        localStorage.setItem("ENCRYPTION_KEY", this.encryptionKey);
        localStorage.setItem("ENCRYPTION_MAC", this.encryptionMac);
        localStorage.setItem("TOKEN", this.token);
    };

    loadFromLocal = (): boolean => {
        const encryptionKey = localStorage.getItem("ENCRYPTION_KEY");
        const encryptionMac = localStorage.getItem("ENCRYPTION_MAC");
        const token = localStorage.getItem("TOKEN");
        if (encryptionKey != null && encryptionMac != null && token != null) {
            this.encryptionKey = encryptionKey;
            this.encryptionMac = encryptionMac;
            this.token = token;
            this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            return true;
        } else {
            return false;
        }
    };

    logout = () => {
        localStorage.clear();
        this.encryptionKey = "";
        this.encryptionMac = "";
        this.token = "";
        this.privateKey = "";
        this.symKey = "";
    };

    login = async (email: string, password: string): Promise<boolean> => {
        const masterKey = await getMasterKey(email, password);
        const masterHash = await getMasterHash(masterKey, password);
        const response = await this.instance.post(`${this.host}/api/login`, {
            email,
            master_hash: masterHash,
        });
        const encryptionKeys = await getEncryptionKey(masterKey);
        const token = response.data.token;
        this.encryptionKey = encryptionKeys.encryption_key;
        this.encryptionMac = encryptionKeys.encryption_mac;
        this.token = token;
        this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        this.storeLocal();
        return true;
    };

    isAvailableUsername = async (username: string): Promise<boolean> => {
        try {
            const response = await this.instance.get(
                `${this.host}/api/register/available/username?username=${username}`
            );
            return response.data.available;
        } catch (e) {
            return false;
        }
    };

    isAvailableEmail = async (email: string): Promise<boolean> => {
        try {
            const response = await this.instance.get(
                `${this.host}/api/register/available/email?email=${email}`
            );
            return response.data.available;
        } catch (e) {
            return false;
        }
    };

    register = async (username: string, email: string, password: string): Promise<boolean> => {
        const masterKey = await getMasterKey(email, password);
        const masterHash = await getMasterHash(masterKey, password);
        const encryptionKeys = await getEncryptionKey(masterKey);
        const { publicKey, privateKey } = await generateRsaPair();
        const symKey = await generateSymKey();
        const encryptedPrivateKey = await aesEncrypt(
            encryptionKeys.encryption_key,
            encryptionKeys.encryption_mac,
            Buffer.from(privateKey, "base64")
        );
        const encryptedSymKey = await aesEncrypt(
            encryptionKeys.encryption_key,
            encryptionKeys.encryption_mac,
            Buffer.from(symKey, "base64")
        );
        const response = await this.instance.post(`${this.host}/api/register`, {
            username,
            email,
            master_hash: masterHash,
            inhibit_login: true,
            public_key: publicKey,
            private_key: encryptedPrivateKey,
            sym_key: encryptedSymKey,
        });
        const token = response.data.token;
        this.encryptionKey = encryptionKeys.encryption_key;
        this.encryptionMac = encryptionKeys.encryption_mac;
        this.token = token;
        this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        this.storeLocal();
        return true;
    };
}

export default AuthController;
