import axios from "axios";
import { aesDecrypt, rsaDecrypt, symDecrypt } from "betro-js-lib";
import { bufferToImageUrl } from "../util/bufferToImage";
import AuthController from "./auth";
import { parseUserProfile } from "./profileHelper";
import {
    FeedPageInfo,
    PostResource,
    PostResourceUser,
    PostResponse,
    PostsFeedResponse,
} from "./types";

class FeedController {
    auth: AuthController;
    constructor(auth: AuthController) {
        this.auth = auth;
    }

    transformPostFeed = async (
        feed: PostsFeedResponse,
        postToSymKey: (post: PostResponse, keys: { [key_id: string]: string }) => Promise<string>
    ): Promise<Array<PostResource>> => {
        const posts: Array<PostResource> = [];
        const users: { [user_id: string]: PostResourceUser } = {};
        for (const user_id in feed.users) {
            if (Object.prototype.hasOwnProperty.call(feed.users, user_id)) {
                const user = feed.users[user_id];
                if (user.sym_key != null) {
                    const userProfile = await parseUserProfile(
                        user.sym_key,
                        this.auth.privateKey,
                        user
                    );
                    users[user_id] = {
                        username: user.username,
                        first_name: userProfile.first_name,
                        last_name: userProfile.last_name,
                        profile_picture:
                            userProfile.profile_picture != null
                                ? bufferToImageUrl(userProfile.profile_picture)
                                : null,
                    };
                }
            }
        }
        for (const post of feed.posts) {
            const sym_key = await postToSymKey(post, feed.keys);
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
            posts.push({
                id: post.id,
                created_at: post.created_at,
                text_content: text_content,
                media_content: media_content,
                media_encoding: post.media_encoding,
                user: users[post.user_id],
            });
        }
        return posts;
    };

    fetchUserPosts = async (
        username: string,
        after: string | undefined
    ): Promise<{ data: Array<PostResource>; pageInfo: FeedPageInfo } | null> => {
        const limit = 5;
        if (after == null) {
            after = Buffer.from(new Date().toISOString(), "utf-8").toString("base64");
        }
        try {
            const response = await axios.get(
                `${this.auth.host}/api/user/${username}/posts?limit=${limit}&after=${after}`,
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const posts: PostsFeedResponse = response.data;
            const data = await this.transformPostFeed(posts, async (post, keys) => {
                const symKey = await rsaDecrypt(this.auth.privateKey, keys[post.key_id]);
                if (symKey == null) {
                    throw Error("Decryption issues");
                }
                const sym_key = symKey.toString("base64");
                return sym_key;
            });
            return {
                data,
                pageInfo: response.data.pageInfo,
            };
        } catch (e) {
            return null;
        }
    };

    fetchOwnPosts = async (
        after: string | undefined
    ): Promise<{ data: Array<PostResource>; pageInfo: FeedPageInfo } | null> => {
        const limit = 29;
        if (after == null) {
            after = Buffer.from(new Date().toISOString(), "utf-8").toString("base64");
        }
        try {
            const response = await axios.get(
                `${this.auth.host}/api/account/posts?limit=${limit}&after=${after}`,
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const posts: PostsFeedResponse = response.data;
            const data = await this.transformPostFeed(posts, async (post, keys) => {
                const symKey = await aesDecrypt(
                    this.auth.encryptionKey,
                    this.auth.encryptionMac,
                    keys[post.key_id]
                );
                const sym_key = symKey.data.toString("base64");
                return sym_key;
            });
            return {
                data,
                pageInfo: response.data.pageInfo,
            };
        } catch (e) {
            return null;
        }
    };

    fetchHomeFeed = async (
        after: string | undefined
    ): Promise<{ data: Array<PostResource>; pageInfo: FeedPageInfo } | null> => {
        const limit = 20;
        if (after == null) {
            after = Buffer.from(new Date().toISOString(), "utf-8").toString("base64");
        }
        try {
            const response = await axios.get(
                `${this.auth.host}/api/feed?limit=${limit}&after=${after}`,
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const posts: PostsFeedResponse = response.data;
            const data = await this.transformPostFeed(posts, async (post, keys) => {
                const symKey = await rsaDecrypt(this.auth.privateKey, keys[post.key_id]);
                if (symKey == null) {
                    throw Error("Decryption issues");
                }
                const sym_key = symKey.toString("base64");
                return sym_key;
            });
            return {
                data,
                pageInfo: response.data.pageInfo,
            };
        } catch (e) {
            return null;
        }
    };
}

export default FeedController;
