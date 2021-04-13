import axios from 'axios';
import {
    aesDecrypt,
    aesEncrypt,
    generateRsaPair,
    generateSymKey,
    getEncryptionKey,
    getMasterHash,
    getMasterKey,
    rsaEncrypt,
    symEncrypt,
} from 'betro-js-lib';

export const createTextPost = async (
    token: string,
    group_id: string,
    encrypted_sym_key: string,
    encryption_key: string,
    encryption_mac: string,
    text: string
): Promise<null> => {
    try {
        const sym_key = await aesDecrypt(encryption_key, encryption_mac, encrypted_sym_key);
        const encryptedText = await symEncrypt(sym_key.data.toString('base64'), Buffer.from(text));
        const response = await axios.post(
            'http://localhost:4000/api/post',
            {
                group_id: group_id,
                text_content: encryptedText,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (e) {
        return null;
    }
};
