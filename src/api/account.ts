import axios, { AxiosResponse } from "axios";
import { aesDecrypt, aesEncrypt, symDecrypt, symEncrypt } from "betro-js-lib";
import AuthController from "./auth";
import {
    CountResponse,
    UserProfilePostRequest,
    UserProfilePutRequest,
    UserProfileResponse,
    WhoAmiResponse,
} from "./types";

class AccountController {
    auth: AuthController;
    constructor(auth: AuthController) {
        this.auth = auth;
    }

    fetchProfilePicture = async (): Promise<Buffer | null> => {
        if (!this.auth.isAuthenticated()) return null;
        try {
            const response = await axios.get(`${this.auth.host}/api/account/profile_picture`, {
                headers: { Authorization: `Bearer ${this.auth.token}` },
            });
            const data = response.data;
            const profile_picture = await symDecrypt(this.auth.symKey, data);
            return profile_picture;
        } catch (e) {
            return null;
        }
    };

    fetchKeys = async (): Promise<boolean> => {
        if (!this.auth.isAuthenticated()) return false;
        const response = await axios.get(`${this.auth.host}/api/account/keys`, {
            headers: { Authorization: `Bearer ${this.auth.token}` },
        });
        const data = response.data;

        const encryptedPrivateKey = data.private_key;
        const encryptedSymKey = data.sym_key;
        const privateKey = await aesDecrypt(
            this.auth.encryptionKey,
            this.auth.encryptionMac,
            encryptedPrivateKey
        );
        if (privateKey.isVerified) {
            const private_key = privateKey.data.toString("base64");
            let sym_key: string | undefined;
            const symKey = await aesDecrypt(
                this.auth.encryptionKey,
                this.auth.encryptionMac,
                encryptedSymKey
            );
            if (symKey.isVerified) {
                sym_key = symKey.data.toString("base64");
                this.auth.privateKey = private_key;
                this.auth.symKey = sym_key;
                return true;
            }
        }
        return false;
    };

    whoAmi = async (): Promise<WhoAmiResponse | null> => {
        if (!this.auth.isAuthenticated()) return null;
        const response = await axios.get(`${this.auth.host}/api/account/whoami`, {
            headers: { Authorization: `Bearer ${this.auth.token}` },
        });
        const data = response.data;
        let first_name: string | undefined;
        let last_name: string | undefined;
        if (data.first_name != null) {
            const first_name_bytes = await symDecrypt(this.auth.symKey, data.first_name);
            first_name = first_name_bytes?.toString("utf-8");
        }
        if (data.last_name != null) {
            const last_name_bytes = await symDecrypt(this.auth.symKey, data.last_name);
            last_name = last_name_bytes?.toString("utf-8");
        }
        return {
            user_id: data.user_id,
            username: data.username,
            email: data.email,
            first_name: first_name,
            last_name: last_name,
        };
    };

    fetchCounts = async (): Promise<CountResponse | null> => {
        try {
            const include_fields = [
                "notifications",
                "settings",
                "groups",
                "followers",
                "followees",
                "approvals",
                "posts",
            ];
            const response = await axios.get(
                `${this.auth.host}/api/account/count?include_fields=${include_fields.join(",")}`,
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

    fetchProfile = async (): Promise<UserProfileResponse | null> => {
        try {
            const response = await axios.get<
                null,
                AxiosResponse<{
                    first_name: string;
                    last_name: string;
                    profile_picture: string;
                    sym_key: string;
                }>
            >(`${this.auth.host}/api/account/profile`, {
                headers: { Authorization: `Bearer ${this.auth.token}` },
            });
            const data = response.data;
            const encrypted_first_name = data.first_name;
            const encrypted_last_name = data.last_name;
            const encrypted_profile_picture = data.profile_picture;
            const encrypted_sym_key = data.sym_key;
            const aesDecrypted = await aesDecrypt(
                this.auth.encryptionKey,
                this.auth.encryptionMac,
                encrypted_sym_key
            );
            const sym_key = aesDecrypted.data.toString("base64");
            const first_name = await symDecrypt(sym_key, encrypted_first_name);
            const last_name = await symDecrypt(sym_key, encrypted_last_name);
            const profile_picture = await symDecrypt(sym_key, encrypted_profile_picture);
            if (first_name == null || last_name == null || profile_picture == null) {
                throw new Error("Failed decryption");
            }
            return {
                first_name: first_name.toString("utf-8"),
                last_name: last_name.toString("utf-8"),
                profile_picture: profile_picture,
                sym_key: sym_key,
            };
        } catch (e) {
            return null;
        }
    };

    createProfile = async (
        first_name: string,
        last_name: string,
        profile_picture: Buffer | null
    ): Promise<UserProfileResponse | null> => {
        try {
            const encrypted_sym_key = await aesEncrypt(
                this.auth.encryptionKey,
                this.auth.encryptionMac,
                Buffer.from(this.auth.symKey, "base64")
            );
            const encrypted_first_name = await symEncrypt(
                this.auth.symKey,
                Buffer.from(first_name)
            );
            const encrypted_last_name = await symEncrypt(this.auth.symKey, Buffer.from(last_name));
            const request: UserProfilePostRequest = {
                sym_key: encrypted_sym_key,
                first_name: encrypted_first_name,
                last_name: encrypted_last_name,
            };
            if (profile_picture != null) {
                const encrypted_profile_picture = await symEncrypt(
                    this.auth.symKey,
                    profile_picture
                );
                request.profile_picture = encrypted_profile_picture;
            }
            const response = await axios.post(`${this.auth.host}/api/account/profile`, request, {
                headers: { Authorization: `Bearer ${this.auth.token}` },
            });
            const data = response.data;
            return data;
        } catch (e) {
            return null;
        }
    };

    updateProfile = async (
        first_name?: string,
        last_name?: string,
        profile_picture?: Buffer | null
    ): Promise<UserProfileResponse | null> => {
        try {
            const request: UserProfilePutRequest = {};
            if (first_name != null) {
                request.first_name = await symEncrypt(this.auth.symKey, Buffer.from(first_name));
            }
            if (last_name != null) {
                request.last_name = await symEncrypt(this.auth.symKey, Buffer.from(last_name));
            }
            if (profile_picture != null) {
                request.profile_picture = await symEncrypt(this.auth.symKey, profile_picture);
            }
            const response = await axios.put(`${this.auth.host}/api/account/profile`, request, {
                headers: { Authorization: `Bearer ${this.auth.token}` },
            });
            const data = response.data;
            return data;
        } catch (e) {
            return null;
        }
    };
}

export default AccountController;
