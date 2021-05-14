import { AxiosResponse } from "axios";
import { symDecrypt, deriveExchangeSymKey, symEncrypt } from "betro-js-lib";
import { bufferToImageUrl } from "../util/bufferToImage";
import AuthController from "./auth";
import { parsePost, parseUserProfile } from "./profileHelper";
import { GetPostResponse, PostResource, PostResourceUser, LikeResponse } from "./types";

class PostController {
    auth: AuthController;
    constructor(auth: AuthController) {
        this.auth = auth;
    }

    getPost = async (id: string): Promise<PostResource | null> => {
        const response = await this.auth.instance.get<null, AxiosResponse<GetPostResponse>>(
            `/api/post/${id}`
        );
        const resp = response.data;
        let user: PostResourceUser = {
            username: resp.user.username,
        };
        if (
            resp.user.encrypted_profile_sym_key != null &&
            resp.user.public_key != null &&
            resp.user.own_key_id != null
        ) {
            const userProfile = await parseUserProfile(
                resp.user.encrypted_profile_sym_key,
                resp.user.public_key,
                this.auth.ecdhKeys[resp.user.own_key_id].privateKey,
                user
            );
            user = {
                username: resp.user.username,
                first_name: userProfile.first_name,
                last_name: userProfile.last_name,
                profile_picture:
                    userProfile.profile_picture != null
                        ? bufferToImageUrl(userProfile.profile_picture)
                        : null,
            };
        }
        if (resp.user.own_key_id == null || resp.user.public_key == null) {
            throw Error("Decryption issues");
        }
        const ownKey = this.auth.ecdhKeys[resp.user.own_key_id];
        const derivedKey = await deriveExchangeSymKey(resp.user.public_key, ownKey.privateKey);
        const symKey = await symDecrypt(derivedKey, resp.post.key);
        if (symKey == null) {
            throw Error("Decryption issues");
        }
        const sym_key = symKey.toString("base64");
        const parsedPost = await parsePost(resp.post, sym_key);
        return {
            ...parsedPost,
            user,
        };
    };

    createPost = async (
        group_id: string,
        encrypted_sym_key: string,
        text: string | null,
        media_encoding: string | null,
        media: Buffer | null
    ): Promise<null> => {
        try {
            const sym_key = await symDecrypt(this.auth.encryptionKey, encrypted_sym_key);
            let encryptedText: string | null = null;
            if (text != null && sym_key != null) {
                encryptedText = await symEncrypt(sym_key.toString("base64"), Buffer.from(text));
            }
            let encryptedMedia: string | null = null;
            if (media != null && sym_key != null) {
                encryptedMedia = await symEncrypt(sym_key.toString("base64"), media);
            }
            const response = await this.auth.instance.post(`/api/post`, {
                group_id: group_id,
                text_content: encryptedText,
                media_content: encryptedMedia,
            });
            return response.data;
        } catch (e) {
            return null;
        }
    };

    like = async (id: string): Promise<LikeResponse> => {
        const response = await this.auth.instance.post<null, AxiosResponse<LikeResponse>>(
            `/api/post/${id}/like`,
            {}
        );
        return response.data;
    };

    unlike = async (id: string): Promise<LikeResponse> => {
        const response = await this.auth.instance.post<null, AxiosResponse<LikeResponse>>(
            `/api/post/${id}/unlike`,
            {}
        );
        return response.data;
    };
}

export default PostController;
