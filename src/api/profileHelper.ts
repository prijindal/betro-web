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
    const sym_key = (await rsaDecrypt(private_key, encrypted_sym_key)).toString("base64");
    response.first_name =
        res.first_name != null
            ? (await symDecrypt(sym_key, res.first_name)).toString("utf-8")
            : null;
    response.last_name =
        res.last_name != null ? (await symDecrypt(sym_key, res.last_name)).toString("utf-8") : null;
    response.profile_picture =
        res.profile_picture != null ? await symDecrypt(sym_key, res.profile_picture) : null;
    return response;
};
