import axios, { AxiosResponse } from "axios";
import { aesDecrypt, rsaDecrypt, symEncrypt } from "betro-js-lib";
import { bufferToImageUrl } from "../util/bufferToImage";
import AuthController from "./auth";
import { parsePost, parseUserProfile } from "./profileHelper";
import { GetPostResponse, PostResource, PostResourceUser } from "./types";

class PostController {
    auth: AuthController;
    constructor(auth: AuthController) {
        this.auth = auth;
    }

    getPost = async (id: string): Promise<PostResource | null> => {
        const response = await axios.get<null, AxiosResponse<GetPostResponse>>(
            `${this.auth.host}/api/post/${id}`,
            {
                headers: { Authorization: `Bearer ${this.auth.token}` },
            }
        );
        const resp = response.data;
        let user: PostResourceUser = {
            username: resp.user.username,
        };
        if (resp.user.sym_key != null) {
            const userProfile = await parseUserProfile(
                resp.user.sym_key,
                this.auth.privateKey,
                resp.user
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
        const symKey = await rsaDecrypt(this.auth.privateKey, resp.post.key);
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
            const sym_key = await aesDecrypt(
                this.auth.encryptionKey,
                this.auth.encryptionMac,
                encrypted_sym_key
            );
            let encryptedText: string | null = null;
            if (text != null) {
                encryptedText = await symEncrypt(
                    sym_key.data.toString("base64"),
                    Buffer.from(text)
                );
            }
            let encryptedMedia: string | null = null;
            if (media != null) {
                encryptedMedia = await symEncrypt(sym_key.data.toString("base64"), media);
            }
            const response = await axios.post(
                `${this.auth.host}/api/post`,
                {
                    group_id: group_id,
                    text_content: encryptedText,
                    media_content: encryptedMedia,
                },
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            return response.data;
        } catch (e) {
            return null;
        }
    };
}

export default PostController;
