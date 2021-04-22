import axios from "axios";
import { aesDecrypt, aesEncrypt, generateSymKey, rsaEncrypt } from "betro-js-lib";
import { API_HOST } from "../constants";
export interface ApprovalResponse {
    id: string;
    follower_id: string;
    public_key: string;
    username: string;
}
export interface GroupResponse {
    id: string;
    sym_key: string;
    name: string;
    is_default: boolean;
}

export const fetchPendingApprovals = async (
    token: string
): Promise<Array<ApprovalResponse> | null> => {
    try {
        const response = await axios.get(`${API_HOST}/api/follow/approvals`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};

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

export const approveUser = async (
    token: string,
    followId: string,
    publicKey: string,
    group_id: string,
    encryption_key: string,
    encryption_mac: string,
    encrypted_group_sym_key: string
): Promise<{ is_following: boolean; is_approved: boolean; email: string } | null> => {
    const decryptedGroupSymKey = await aesDecrypt(
        encryption_key,
        encryption_mac,
        encrypted_group_sym_key
    );
    const groupSymKey = await rsaEncrypt(publicKey, decryptedGroupSymKey.data);
    try {
        const response = await axios.post(
            `${API_HOST}/api/follow/approve`,
            {
                follow_id: followId,
                group_id: group_id,
                group_sym_key: groupSymKey,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};
