import axios from "axios";
import { aesDecrypt, symEncrypt } from "betro-js-lib";
import { API_HOST } from "../constants";

export const createPost = async (
    token: string,
    group_id: string,
    encrypted_sym_key: string,
    encryption_key: string,
    encryption_mac: string,
    text: string | null,
    media_encoding: string | null,
    media: Buffer | null
): Promise<null> => {
    try {
        const sym_key = await aesDecrypt(encryption_key, encryption_mac, encrypted_sym_key);
        let encryptedText: string | null = null;
        if (text != null) {
            encryptedText = await symEncrypt(sym_key.data.toString("base64"), Buffer.from(text));
        }
        let encryptedMedia: string | null = null;
        if (media != null) {
            encryptedMedia = await symEncrypt(sym_key.data.toString("base64"), media);
        }
        const response = await axios.post(
            `${API_HOST}/api/post`,
            {
                group_id: group_id,
                text_content: encryptedText,
                media_content: encryptedMedia,
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
