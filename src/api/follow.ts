import axios from "axios";
import { aesDecrypt, rsaEncrypt } from "betro-js-lib";
import { PaginatedResponse } from "./PaginatedResponse";
import { parseUserProfile } from "./profileHelper";

import AuthController from "./auth";

export interface ApprovalResponse {
    id: string;
    follower_id: string;
    public_key: string;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    profile_picture?: Buffer | null;
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
    first_name?: string | null;
    last_name?: string | null;
    profile_picture?: Buffer | null;
}

export interface FolloweeResponse {
    follow_id: string;
    is_approved: boolean;
    user_id: string;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    profile_picture?: Buffer | null;
}

export interface UserInfo {
    is_following: boolean;
    is_approved: boolean;
    username: string;
    public_key: string | null;
    first_name?: string | null;
    last_name?: string | null;
    profile_picture?: Buffer | null;
}

class FollowController {
    auth: AuthController;
    constructor(auth: AuthController) {
        this.auth = auth;
    }

    fetchPendingApprovals = async (
        after?: string
    ): Promise<PaginatedResponse<ApprovalResponse> | null> => {
        const limit = 50;
        try {
            const response = await axios.get(
                `${this.auth.host}/api/follow/approvals?limit=${limit}&after=${after}`,
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const resp = response.data;
            const data: Array<ApprovalResponse> = [];
            for (const res of resp.data) {
                const userResponse = await parseUserProfile(res.sym_key, this.auth.privateKey, res);
                data.push({
                    id: res.id,
                    follower_id: res.follower_id,
                    public_key: res.public_key,
                    username: res.username,
                    ...userResponse,
                });
            }
            return { ...resp, data };
        } catch (e) {
            return null;
        }
    };

    fetchFollowers = async (
        after?: string
    ): Promise<PaginatedResponse<FollowerResponse> | null> => {
        const limit = 50;
        try {
            const response = await axios.get(
                `${this.auth.host}/api/follow/followers?limit=${limit}&after=${after}`,
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const resp = response.data;
            const data: Array<FollowerResponse> = [];
            for (const res of resp.data) {
                const userResponse = await parseUserProfile(res.sym_key, this.auth.privateKey, res);
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
                    ...userResponse,
                });
            }
            return { ...resp, data };
        } catch (e) {
            return null;
        }
    };

    fetchFollowees = async (
        after?: string
    ): Promise<PaginatedResponse<FolloweeResponse> | null> => {
        const limit = 50;
        try {
            const response = await axios.get(
                `${this.auth.host}/api/follow/followees?limit=${limit}&after=${after}`,
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const resp = response.data;
            const data: Array<FolloweeResponse> = [];
            for (const res of resp.data) {
                let row: FolloweeResponse = {
                    follow_id: res.follow_id,
                    is_approved: res.is_approved,
                    user_id: res.user_id,
                    username: res.username,
                };
                if (res.sym_key != null) {
                    const userResponse = await parseUserProfile(
                        res.sym_key,
                        this.auth.privateKey,
                        res
                    );
                    row = { ...row, ...userResponse };
                }
                data.push(row);
            }
            return { ...resp, data };
        } catch (e) {
            return null;
        }
    };

    followUser = async (
        username: string,
        public_key: string
    ): Promise<{ is_following: boolean; is_approved: boolean; email: string } | null> => {
        try {
            const encrypted_sym_key = await rsaEncrypt(
                public_key,
                Buffer.from(this.auth.symKey, "base64")
            );
            const response = await axios.post(
                `${this.auth.host}/api/follow/`,
                {
                    followee_username: username,
                    sym_key: encrypted_sym_key,
                },
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const data = response.data;
            return data;
        } catch (e) {
            return null;
        }
    };

    approveUser = async (
        followId: string,
        publicKey: string,
        group_id: string,
        encrypted_group_sym_key: string
    ): Promise<{ is_following: boolean; is_approved: boolean; email: string } | null> => {
        const decryptedGroupSymKey = await aesDecrypt(
            this.auth.encryptionKey,
            this.auth.encryptionMac,
            encrypted_group_sym_key
        );
        const groupSymKey = await rsaEncrypt(publicKey, decryptedGroupSymKey.data);
        const userSymKey = await rsaEncrypt(publicKey, Buffer.from(this.auth.symKey, "base64"));
        try {
            const response = await axios.post(
                `${this.auth.host}/api/follow/approve`,
                {
                    follow_id: followId,
                    group_id: group_id,
                    group_sym_key: groupSymKey,
                    followee_sym_key: userSymKey,
                },
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const data = response.data;
            return data;
        } catch (e) {
            return null;
        }
    };

    fetchUserInfo = async (username: string): Promise<UserInfo | null> => {
        try {
            const response = await axios.get(`${this.auth.host}/api/user/${username}`, {
                headers: { Authorization: `Bearer ${this.auth.token}` },
            });
            const data = response.data;
            if (data.sym_key != null) {
                const userResponse = await parseUserProfile(
                    data.sym_key,
                    this.auth.privateKey,
                    data
                );
                return { ...data, ...userResponse };
            } else {
                return { ...data, first_name: null, last_name: null, profile_picture: null };
            }
        } catch (e) {
            return null;
        }
    };
}

export default FollowController;
