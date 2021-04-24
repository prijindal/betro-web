import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchUserInfo, fetchUserPosts, followUser, PostResource } from "../../api/user";
import { wrapLayout } from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";

const User = () => {
    const params: any = useParams();
    const auth = useSelector(getAuth);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [posts, setPosts] = useState<Array<PostResource>>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    useEffect(() => {
        async function fetchPosts() {
            if (auth.token !== null && auth.privateKey !== null) {
                const resp = await fetchUserPosts(auth.token, params.username, auth.privateKey);
                if (resp !== null) {
                    setPosts(resp);
                }
            }
        }
        async function fetchInfo() {
            if (auth.token !== null) {
                const userInfo = await fetchUserInfo(auth.token, params.username);
                setLoaded(true);
                if (userInfo !== null) {
                    setUsername(userInfo.username);
                    setIsFollowing(userInfo.is_following);
                    setIsApproved(userInfo.is_approved);
                    setPublicKey(userInfo.public_key);
                    if (userInfo.is_approved) {
                        fetchPosts();
                    }
                }
            }
        }
        fetchInfo();
    }, [auth.token, params.username, auth.privateKey]);
    const followHandler = useCallback(() => {
        if (auth.token !== null && publicKey != null && auth.symKey != null) {
            followUser(auth.token, params.username, publicKey, auth.symKey);
        }
    }, [auth.token, publicKey, auth.symKey, params.username]);
    if (loaded === false) {
        return <div>Loading</div>;
    }
    if (!isFollowing) {
        return (
            <div>
                <span>{username}</span>
                <button onClick={followHandler}>Follow</button>
            </div>
        );
    }
    if (!isApproved) {
        return (
            <div>
                <span>{username}</span>
                <span>Not approved yet</span>
            </div>
        );
    }
    return (
        <div>
            {posts.length === 0 && <div>No posts found</div>}
            {posts.map((post) => (
                <div key={post.id} style={{ margin: "20px 0" }}>
                    <div>{post.username}:</div>
                    <div style={{ marginLeft: "10px" }}>
                        {post.text_content !== null && post.text_content.toString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default wrapLayout(User);
