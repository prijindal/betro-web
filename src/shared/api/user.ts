import axios from 'axios';
import { rsaDecrypt, symDecrypt } from 'betro-js-lib';

export interface PostResource {
    id: string;
    text_content: Buffer | null;
    media_content: Buffer | null;
    media_encoding: string;
    email: string;
    created_at: Date;
}

export interface PostsFeedResponse {
    posts: Array<PostResponse>;
    users: { [user_id: string]: PostUserResponse };
    keys: { [key_id: string]: string };
}

export interface PostResponse {
    id: string;
    user_id: string;
    media_content: string;
    media_encoding: string;
    text_content: string;
    key_id: string;
    created_at: Date;
}

export interface PostUserResponse {
    email: string;
}

export const followUser = async (
    token: string,
    userId: string
): Promise<{ is_following: boolean; is_approved: boolean; email: string } | null> => {
    try {
        const response = await axios.post(
            'http://localhost:4000/api/follow/',
            {
                followee_id: userId,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = response.data;
        console.log(data);
        return data;
    } catch (e) {
        return null;
    }
};

export const fetchUserInfo = async (
    token: string,
    userId: string
): Promise<{ is_following: boolean; is_approved: boolean; email: string } | null> => {
    try {
        const response = await axios.get(`http://localhost:4000/api/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        console.log(data);
        return data;
    } catch (e) {
        return null;
    }
};

export const fetchUserPosts = async (
    token: string,
    userId: string,
    private_key: string
): Promise<Array<PostResource> | null> => {
    try {
        const response = await axios.get(`http://localhost:4000/api/user/${userId}/posts`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data: PostsFeedResponse = response.data;
        const posts: Array<PostResource> = [];
        for (const post of data.posts) {
            const symKey = await rsaDecrypt(private_key, data.keys[post.key_id]);
            const sym_key = symKey.toString('base64');
            let text: Buffer | null = null;
            let media: Buffer | null = null;
            if (post.text_content !== null) {
                text = await symDecrypt(sym_key, post.text_content);
            }
            if (post.media_content !== null) {
                media = await symDecrypt(sym_key, post.media_content);
            }
            posts.push({
                id: post.id,
                created_at: post.created_at,
                text_content: text,
                media_content: media,
                media_encoding: post.media_encoding,
                email: data.users[post.user_id].email,
            });
        }
        return posts;
    } catch (e) {
        return null;
    }
};
