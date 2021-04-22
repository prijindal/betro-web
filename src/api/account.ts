import axios from "axios";
import { aesDecrypt, rsaEncrypt } from "betro-js-lib";
import moment from "moment";
import { API_HOST } from "../constants";
import { PaginatedResponse } from "./PaginatedResponse";
export interface ApprovalResponse {
    id: string;
    follower_id: string;
    public_key: string;
    username: string;
}

export interface CountResponse {
    notifications: number;
    notificationSettings: number;
    groups: number;
    followers: number;
    followees: number;
    approvals: number;
    posts: number;
}

export const fetchCounts = async (token: string): Promise<CountResponse | null> => {
    try {
        const include_fields = [
            "notifications",
            "notificationSettings",
            "groups",
            "followers",
            "followees",
            "approvals",
            "posts",
        ];
        const response = await axios.get(
            `${API_HOST}/api/account/count?include_fields=${include_fields.join(",")}`,
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

export const fetchPendingApprovals = async (
    token: string,
    after?: string
): Promise<PaginatedResponse<ApprovalResponse> | null> => {
    const limit = 50;
    try {
        const response = await axios.get(
            `${API_HOST}/api/follow/approvals?limit=${limit}&after=${after}`,
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
