import axios from "axios";
import {
    aesDecrypt,
    aesEncrypt,
    generateRsaPair,
    getEncryptionKey,
    getMasterHash,
    getMasterKey,
} from "betro-js-lib";
import { LoginPayload } from "../store/app/types";

const storeLocal = (payload: LoginPayload) => {
    localStorage.setItem("ENCRYPTION_KEY", payload.encryptionKey);
    localStorage.setItem("ENCRYPTION_MAC", payload.encryptionMac);
    localStorage.setItem("TOKEN", payload.token);
};

export const verifyLogin = async (token: string): Promise<string | null> => {
    try {
        const response = await axios.get("http://localhost:4000/api/account/keys", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.private_key;
    } catch (e) {
        return null;
    }
};

export const login = async (email: string, password: string): Promise<LoginPayload> => {
    const masterKey = await getMasterKey(email, password);
    const masterHash = await getMasterHash(masterKey, password);
    const response = await axios.post("http://localhost:4000/api/login", {
        email,
        master_hash: masterHash,
    });
    const encryptionKeys = await getEncryptionKey(masterKey);
    const token = response.data.token;
    const encryptedPrivateKey = response.data.private_key;
    const privateKeyD = await aesDecrypt(
        encryptionKeys.encryption_key,
        encryptionKeys.encryption_mac,
        encryptedPrivateKey
    );
    if (privateKeyD.isVerified === false) {
        throw new Error();
    }
    const payload: LoginPayload = {
        encryptionKey: encryptionKeys.encryption_key,
        encryptionMac: encryptionKeys.encryption_mac,
        token: token,
        privateKey: privateKeyD.data.toString("base64"),
    };
    storeLocal(payload);
    return payload;
};

export const register = async (
    username: string,
    email: string,
    password: string
): Promise<LoginPayload> => {
    const masterKey = await getMasterKey(email, password);
    const masterHash = await getMasterHash(masterKey, password);
    const encryptionKeys = await getEncryptionKey(masterKey);
    const { publicKey, privateKey } = await generateRsaPair();
    const encryptedPrivateKey = await aesEncrypt(
        encryptionKeys.encryption_key,
        encryptionKeys.encryption_mac,
        Buffer.from(privateKey, "base64")
    );
    const response = await axios.post("http://localhost:4000/api/register", {
        username,
        email,
        master_hash: masterHash,
        inhibit_login: true,
        public_key: publicKey,
        private_key: encryptedPrivateKey,
    });
    const token = response.data.token;
    const payload: LoginPayload = {
        encryptionKey: encryptionKeys.encryption_mac,
        encryptionMac: encryptionKeys.encryption_key,
        token: token,
        privateKey,
    };
    storeLocal(payload);
    return payload;
};

export const isAvailableUsername = async (username: string): Promise<boolean> => {
    try {
        const response = await axios.get(
            `http://localhost:4000/api/register/available/username?username=${username}`
        );
        return response.data.available;
    } catch (e) {
        if (e.response.status === 400) {
            return false;
        } else {
            throw e;
        }
    }
};

export const isAvailableEmail = async (email: string): Promise<boolean> => {
    try {
        const response = await axios.get(
            `http://localhost:4000/api/register/available/email?email=${email}`
        );
        return response.data.available;
    } catch (e) {
        if (e.response.status === 402) {
            return false;
        } else {
            throw e;
        }
    }
};
