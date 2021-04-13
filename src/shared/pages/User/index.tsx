import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { AppState, AuthState } from 'store/app/types';
import { fetchUserInfo, fetchUserPosts, followUser, PostResource } from 'api/user';

const Page = () => {
    const params: any = useParams();
    const auth = useSelector<{ app: AppState }, AuthState>((a) => a.app.auth);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [posts, setPosts] = useState<Array<PostResource>>([]);
    const [email, setEmail] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    useEffect(() => {
        async function fetchPosts() {
            if (auth.token !== null && auth.privateKey !== null) {
                const resp = await fetchUserPosts(auth.token, params.user_id, auth.privateKey);
                if (resp !== null) {
                    console.log(resp.length);
                    setPosts(resp);
                }
            }
        }
        async function fetchInfo() {
            if (auth.token !== null) {
                const userInfo = await fetchUserInfo(auth.token, params.user_id);
                setLoaded(true);
                if (userInfo !== null) {
                    setEmail(userInfo.email);
                    setIsFollowing(userInfo.is_following);
                    setIsApproved(userInfo.is_approved);
                    if (userInfo.is_approved) {
                        fetchPosts();
                    }
                }
            }
        }
        fetchInfo();
    }, [auth.token, params.user_id, auth.encryptionKey, auth.encryptionMac]);
    const followHandler = () => {
        if (auth.token !== null) {
            followUser(auth.token, params.user_id);
        }
    };
    if (loaded === false) {
        return <div>Loading</div>;
    }
    if (!isFollowing) {
        return (
            <div>
                <span>{email}</span>
                <button onClick={followHandler}>Follow</button>
            </div>
        );
    }
    if (!isApproved) {
        return (
            <div>
                <span>{email}</span>
                <span>Not approved yet</span>
            </div>
        );
    }
    return (
        <div>
            {posts.map((post) => (
                <div key={post.id} style={{ margin: '20px 0' }}>
                    <div>{post.email}:</div>
                    <div style={{ marginLeft: '10px' }}>
                        {post.text_content !== null && post.text_content.toString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Page;
