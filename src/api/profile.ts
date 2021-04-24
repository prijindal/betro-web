import axios, { AxiosResponse } from "axios";
import { aesDecrypt, aesEncrypt, symDecrypt, symEncrypt } from "betro-js-lib";
import { API_HOST } from "../constants";

export interface UserProfileResponse {
    first_name: string;
    last_name: string;
    profile_picture: Buffer;
    sym_key: string;
}

export interface UserProfilePutRequest {
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
}

export interface UserProfilePostRequest {
    sym_key: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
}

export const fetchProfile = async (
    token: string,
    encryption_key: string,
    encryption_mac: string
): Promise<UserProfileResponse | null> => {
    try {
        const response = await axios.get<
            null,
            AxiosResponse<{
                first_name: string;
                last_name: string;
                profile_picture: string;
                sym_key: string;
            }>
        >(`${API_HOST}/api/account/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        const encrypted_first_name = data.first_name;
        const encrypted_last_name = data.last_name;
        const encrypted_profile_picture = data.profile_picture;
        const encrypted_sym_key = data.sym_key;
        const aesDecrypted = await aesDecrypt(encryption_key, encryption_mac, encrypted_sym_key);
        const sym_key = aesDecrypted.data.toString("base64");
        const first_name = await symDecrypt(sym_key, encrypted_first_name);
        const last_name = await symDecrypt(sym_key, encrypted_last_name);
        const profile_picture = await symDecrypt(sym_key, encrypted_profile_picture);
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

export const createProfile = async (
    token: string,
    sym_key: string,
    encryption_key: string,
    encryption_mac: string,
    first_name: string,
    last_name: string,
    profile_picture: Buffer | null
): Promise<UserProfileResponse | null> => {
    try {
        const encrypted_sym_key = await aesEncrypt(
            encryption_key,
            encryption_mac,
            Buffer.from(sym_key, "base64")
        );
        const encrypted_first_name = await symEncrypt(sym_key, Buffer.from(first_name));
        const encrypted_last_name = await symEncrypt(sym_key, Buffer.from(last_name));
        const request: UserProfilePostRequest = {
            sym_key: encrypted_sym_key,
            first_name: encrypted_first_name,
            last_name: encrypted_last_name,
        };
        if (profile_picture != null) {
            const encrypted_profile_picture = await symEncrypt(sym_key, profile_picture);
            request.profile_picture = encrypted_profile_picture;
        }
        const response = await axios.post(`${API_HOST}/api/account/profile`, request, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};

export const updateProfile = async (
    token: string,
    sym_key: string,
    first_name?: string,
    last_name?: string,
    profile_picture?: Buffer | null
): Promise<UserProfileResponse | null> => {
    try {
        const request: UserProfilePutRequest = {};
        if (first_name != null) {
            request.first_name = await symEncrypt(sym_key, Buffer.from(first_name));
        }
        if (last_name != null) {
            request.last_name = await symEncrypt(sym_key, Buffer.from(last_name));
        }
        if (profile_picture != null) {
            request.profile_picture = await symEncrypt(sym_key, profile_picture);
        }
        const response = await axios.put(`${API_HOST}/api/account/profile`, request, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};
