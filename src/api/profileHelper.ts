import { rsaDecrypt, symDecrypt } from "betro-js-lib";

interface UserProfile {
    first_name?: string | null;
    last_name?: string | null;
    profile_picture?: Buffer | null;
}

export const parseUserProfile = async (
    encrypted_sym_key: string,
    private_key: string,
    res: {
        first_name?: string | null;
        last_name?: string | null;
        profile_picture?: string | null;
    }
): Promise<UserProfile> => {
    const response: UserProfile = {};
    const sym_key_bytes = await rsaDecrypt(private_key, encrypted_sym_key);
    if (sym_key_bytes == null) {
        return response;
    }
    const sym_key = sym_key_bytes.toString("base64");
    const first_name_bytes =
        res.first_name != null ? await symDecrypt(sym_key, res.first_name) : null;
    const last_name_bytes = res.last_name != null ? await symDecrypt(sym_key, res.last_name) : null;
    const profile_picture_bytes =
        res.profile_picture != null ? await symDecrypt(sym_key, res.profile_picture) : null;
    response.first_name = first_name_bytes?.toString("utf-8");
    response.last_name = last_name_bytes?.toString("utf-8");
    response.profile_picture = profile_picture_bytes;
    return response;
};
