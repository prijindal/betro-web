import axios from "axios";
import {
    aesDecrypt,
    aesEncrypt,
    generateRsaPair,
    generateSymKey,
    getEncryptionKey,
    getMasterHash,
    getMasterKey,
    symDecrypt,
} from "betro-js-lib";
import { API_HOST } from "../constants";
import { LoginPayload } from "../store/app/types";
export interface WhoAmiResponse {
    user_id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

const storeLocal = (payload: LoginPayload) => {
    localStorage.setItem("ENCRYPTION_KEY", payload.encryptionKey);
    localStorage.setItem("ENCRYPTION_MAC", payload.encryptionMac);
    localStorage.setItem("TOKEN", payload.token);
};

export const fetchKeys = async (
    token: string,
    encryption_key: string,
    encryption_mac: string
): Promise<{ private_key: string; sym_key: string } | null> => {
    try {
        const response = await axios.get(`${API_HOST}/api/account/keys`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        const encryptedPrivateKey = data.private_key;
        const encryptedSymKey = data.sym_key;
        const privateKey = await aesDecrypt(encryption_key, encryption_mac, encryptedPrivateKey);
        if (privateKey.isVerified) {
            const private_key = privateKey.data.toString("base64");
            let sym_key: string | undefined;
            const symKey = await aesDecrypt(encryption_key, encryption_mac, encryptedSymKey);
            if (symKey.isVerified) {
                sym_key = symKey.data.toString("base64");
                return {
                    private_key,
                    sym_key,
                };
            }
        }
        return null;
    } catch (e) {
        return null;
    }
};

export const whoAmi = async (token: string, symKey: string): Promise<WhoAmiResponse | null> => {
    try {
        const response = await axios.get(`${API_HOST}/api/account/whoami`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        let first_name: string | undefined;
        let last_name: string | undefined;
        if (data.first_name != null) {
            const first_name_bytes = await symDecrypt(symKey, data.first_name);
            first_name = first_name_bytes?.toString("utf-8");
        }
        if (data.last_name != null) {
            const last_name_bytes = await symDecrypt(symKey, data.last_name);
            last_name = last_name_bytes?.toString("utf-8");
        }
        return {
            user_id: data.user_id,
            username: data.username,
            email: data.email,
            first_name: first_name,
            last_name: last_name,
        };
    } catch (e) {
        return null;
    }
};

export const fetchProfilePicture = async (
    token: string,
    symKey: string
): Promise<Buffer | null> => {
    try {
        const response = await axios.get(`${API_HOST}/api/account/profile_picture`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        const profile_picture = await symDecrypt(symKey, data);
        return profile_picture;
    } catch (e) {
        return null;
    }
};

export const login = async (email: string, password: string): Promise<LoginPayload> => {
    const masterKey = await getMasterKey(email, password);
    const masterHash = await getMasterHash(masterKey, password);
    const response = await axios.post(`${API_HOST}/api/login`, {
        email,
        master_hash: masterHash,
    });
    const encryptionKeys = await getEncryptionKey(masterKey);
    const token = response.data.token;
    const privateKeyD = await aesDecrypt(
        encryptionKeys.encryption_key,
        encryptionKeys.encryption_mac,
        response.data.private_key
    );
    if (privateKeyD.isVerified === false) {
        throw new Error();
    }
    const symKeyD = await aesDecrypt(
        encryptionKeys.encryption_key,
        encryptionKeys.encryption_mac,
        response.data.sym_key
    );
    if (symKeyD.isVerified === false) {
        throw new Error();
    }
    const payload: LoginPayload = {
        encryptionKey: encryptionKeys.encryption_key,
        encryptionMac: encryptionKeys.encryption_mac,
        token: token,
        privateKey: privateKeyD.data.toString("base64"),
        symKey: symKeyD.data.toString("base64"),
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
    const response = await axios.post(`${API_HOST}/api/register`, {
        username,
        email,
        master_hash: masterHash,
        inhibit_login: true,
        public_key: publicKey,
        private_key: encryptedPrivateKey,
        sym_key: encryptedSymKey,
    });
    const token = response.data.token;
    const payload: LoginPayload = {
        encryptionKey: encryptionKeys.encryption_key,
        encryptionMac: encryptionKeys.encryption_mac,
        token: token,
        privateKey,
        symKey,
    };
    storeLocal(payload);
    return payload;
};

export const isAvailableUsername = async (username: string): Promise<boolean> => {
    try {
        const response = await axios.get(
            `${API_HOST}/api/register/available/username?username=${username}`
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
        const response = await axios.get(`${API_HOST}/api/register/available/email?email=${email}`);
        return response.data.available;
    } catch (e) {
        if (e.response.status === 402) {
            return false;
        } else {
            throw e;
        }
    }
};
