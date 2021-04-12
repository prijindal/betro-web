import axios from 'axios';
import { getEncryptionKey, getMasterHash, getMasterKey } from 'betro-js-lib';
import { LoginPayload } from '../store/app/types';

const storeLocal = (payload: LoginPayload) => {
    localStorage.setItem('ENCRYPTION_KEY', payload.encryptionKey);
    localStorage.setItem('ENCRYPTION_MAC', payload.encryptionMac);
    localStorage.setItem('TOKEN', payload.token);
};

export const verifyLogin = async (token: string): Promise<boolean> => {
    try {
        const response = await axios.get('http://localhost:4000/api/account/whoami', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.user_id !== null;
    } catch (e) {
        return false;
    }
};

export const login = async (email: string, password: string): Promise<LoginPayload> => {
    const masterKey = await getMasterKey(email, password);
    const masterHash = await getMasterHash(masterKey, password);
    const response = await axios.post('http://localhost:4000/api/login', {
        email,
        master_hash: masterHash,
    });
    const encryptionKeys = await getEncryptionKey(masterKey);
    const token = response.data.token;
    const payload: LoginPayload = {
        encryptionKey: encryptionKeys.encryption_mac,
        encryptionMac: encryptionKeys.encryption_key,
        token: token,
    };
    storeLocal(payload);
    return payload;
};

export const register = async (email: string, password: string): Promise<LoginPayload> => {
    const masterKey = await getMasterKey(email, password);
    const masterHash = await getMasterHash(masterKey, password);
    const response = await axios.post('http://localhost:4000/api/register', {
        email,
        master_hash: masterHash,
        inhibit_login: true,
    });
    const encryptionKeys = await getEncryptionKey(masterKey);
    const token = response.data.token;
    const payload: LoginPayload = {
        encryptionKey: encryptionKeys.encryption_mac,
        encryptionMac: encryptionKeys.encryption_key,
        token: token,
    };
    storeLocal(payload);
    return payload;
};
