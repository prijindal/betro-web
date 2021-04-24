import axios from "axios";
import { aesDecrypt, rsaDecrypt, rsaEncrypt, symDecrypt } from "betro-js-lib";
import { API_HOST } from "../constants";
import { PaginatedResponse } from "./PaginatedResponse";
export interface ApprovalResponse {
    id: string;
    follower_id: string;
    public_key: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    profile_picture: Buffer | null;
}

export interface FollowerResponse {
    follow_id: string;
    group_id: string;
    group_is_default: boolean;
    group_name: string;
    user_id: string;
    username: string;
    is_following: boolean;
    is_following_approved: boolean;
    public_key: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_picture: Buffer | null;
}

export interface FolloweeResponse {
    follow_id: string;
    is_approved: boolean;
    user_id: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    profile_picture: Buffer | null;
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
    private_key: string,
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
        const resp = response.data;
        const data: Array<ApprovalResponse> = [];
        for (const res of resp.data) {
            const encrypted_sym_key = res.sym_key;
            const sym_key = (await rsaDecrypt(private_key, encrypted_sym_key)).toString("base64");
            const first_name =
                res.first_name != null
                    ? (await symDecrypt(sym_key, res.first_name)).toString("utf-8")
                    : null;
            const last_name =
                res.last_name != null
                    ? (await symDecrypt(sym_key, res.last_name)).toString("utf-8")
                    : null;
            const profile_picture =
                res.profile_picture != null ? await symDecrypt(sym_key, res.profile_picture) : null;
            data.push({
                id: res.id,
                follower_id: res.follower_id,
                public_key: res.public_key,
                username: res.username,
                first_name: first_name,
                last_name: last_name,
                profile_picture: profile_picture,
            });
        }
        return { ...resp, data };
    } catch (e) {
        return null;
    }
};

export const fetchFollowers = async (
    token: string,
    private_key: string,
    after?: string
): Promise<PaginatedResponse<FollowerResponse> | null> => {
    const limit = 50;
    try {
        const response = await axios.get(
            `${API_HOST}/api/follow/followers?limit=${limit}&after=${after}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const resp = response.data;
        const data: Array<FollowerResponse> = [];
        for (const res of resp.data) {
            const encrypted_sym_key = res.sym_key;
            const sym_key = (await rsaDecrypt(private_key, encrypted_sym_key)).toString("base64");
            const first_name =
                res.first_name != null
                    ? (await symDecrypt(sym_key, res.first_name)).toString("utf-8")
                    : null;
            const last_name =
                res.last_name != null
                    ? (await symDecrypt(sym_key, res.last_name)).toString("utf-8")
                    : null;
            const profile_picture =
                res.profile_picture != null ? await symDecrypt(sym_key, res.profile_picture) : null;
            data.push({
                follow_id: res.follow_id,
                group_id: res.group_id,
                group_is_default: res.group_is_default,
                group_name: res.group_name,
                user_id: res.user_id,
                username: res.username,
                is_following: res.is_following,
                is_following_approved: res.is_following_approved,
                public_key: res.public_key,
                first_name: first_name,
                last_name: last_name,
                profile_picture: profile_picture,
            });
        }
        return { ...resp, data };
    } catch (e) {
        return null;
    }
};

export const fetchFollowees = async (
    token: string,
    private_key: string,
    after?: string
): Promise<PaginatedResponse<FolloweeResponse> | null> => {
    const limit = 50;
    try {
        const response = await axios.get(
            `${API_HOST}/api/follow/followees?limit=${limit}&after=${after}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const resp = response.data;
        const data: Array<FolloweeResponse> = [];
        for (const res of resp.data) {
            const encrypted_sym_key = res.sym_key;
            const sym_key = (await rsaDecrypt(private_key, encrypted_sym_key)).toString("base64");
            const first_name =
                res.first_name != null
                    ? (await symDecrypt(sym_key, res.first_name)).toString("utf-8")
                    : null;
            const last_name =
                res.last_name != null
                    ? (await symDecrypt(sym_key, res.last_name)).toString("utf-8")
                    : null;
            const profile_picture =
                res.profile_picture != null ? await symDecrypt(sym_key, res.profile_picture) : null;
            data.push({
                follow_id: res.follow_id,
                is_approved: res.is_approved,
                user_id: res.user_id,
                username: res.username,
                first_name: first_name,
                last_name: last_name,
                profile_picture: profile_picture,
            });
        }
        return { ...resp, data };
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
    encrypted_group_sym_key: string,
    symKey: string
): Promise<{ is_following: boolean; is_approved: boolean; email: string } | null> => {
    const decryptedGroupSymKey = await aesDecrypt(
        encryption_key,
        encryption_mac,
        encrypted_group_sym_key
    );
    const groupSymKey = await rsaEncrypt(publicKey, decryptedGroupSymKey.data);
    const userSymKey = await rsaEncrypt(publicKey, Buffer.from(symKey, "base64"));
    try {
        const response = await axios.post(
            `${API_HOST}/api/follow/approve`,
            {
                follow_id: followId,
                group_id: group_id,
                group_sym_key: groupSymKey,
                followee_sym_key: userSymKey,
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
