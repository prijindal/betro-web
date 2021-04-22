import axios from "axios";
import { aesEncrypt, generateSymKey } from "betro-js-lib";
import { API_HOST } from "../constants";
export interface GroupResponse {
    id: string;
    sym_key: string;
    name: string;
    is_default: boolean;
}

export const fetchGroups = async (token: string): Promise<Array<GroupResponse> | null> => {
    try {
        const response = await axios.get(`${API_HOST}/api/groups`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};

export const deleteGroup = async (
    token: string,
    groupId: string
): Promise<{ is_following: boolean; is_approved: boolean; email: string } | null> => {
    try {
        const response = await axios.delete(`${API_HOST}/api/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};

export const createGroup = async (
    token: string,
    encryption_key: string,
    encryption_mac: string,
    name: string,
    is_default: boolean
): Promise<GroupResponse | null> => {
    const sym_key = await generateSymKey();
    const encryptedSymKey = await aesEncrypt(
        encryption_key,
        encryption_mac,
        Buffer.from(sym_key, "base64")
    );
    try {
        const response = await axios.post(
            `${API_HOST}/api/groups`,
            { name: name, sym_key: encryptedSymKey, is_default: is_default },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (e) {
        return null;
    }
};
