import { deriveExchangeSymKey, symDecrypt } from "betro-js-lib";
import { bufferToImageUrl } from "../util/bufferToImage";
import { PostResponse } from "./types";

export interface UserProfile {
    first_name?: string | null;
    last_name?: string | null;
    profile_picture?: Buffer | null;
}

export const parseUserProfile = async (
    encrypted_sym_key: string,
    remote_public_key: string,
    own_private_key: string,
    res: {
        first_name?: string | null;
        last_name?: string | null;
        profile_picture?: string | null;
    }
): Promise<UserProfile> => {
    const response: UserProfile = {};
    const derivedKey = await deriveExchangeSymKey(remote_public_key, own_private_key);
    const sym_key_bytes = await symDecrypt(derivedKey, encrypted_sym_key);
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

export const parsePost = async (
    post: PostResponse,
    sym_key: string
): Promise<{
    id: string;
    text_content: string | null;
    media_content: string | null;
    media_encoding: string | null;
    likes: number;
    is_liked: boolean;
    created_at: Date;
}> => {
    let text_content: string | null = null;
    let media_content: string | null = null;
    if (post.text_content !== null) {
        const text = await symDecrypt(sym_key, post.text_content);
        if (text != null) {
            text_content = text.toString("utf-8");
        }
    }
    if (post.media_content !== null) {
        const media = await symDecrypt(sym_key, post.media_content);
        if (media != null) {
            media_content = bufferToImageUrl(media);
        }
    }
    return {
        id: post.id,
        created_at: post.created_at,
        text_content: text_content,
        media_content: media_content,
        media_encoding: post.media_encoding,
        is_liked: post.is_liked,
        likes: post.likes,
    };
};
