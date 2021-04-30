import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchOwnPosts, PostResource } from "../../api/user";
import { wrapLayout } from "../../components/Layout";
import { getAuth, getProfile } from "../../store/app/selectors";
import PostListItem from "../../components/PostListItem";

const Posts = () => {
    const auth = useSelector(getAuth);
    const [posts, setPosts] = useState<Array<PostResource> | null>(null);
    const profile = useSelector(getProfile);
    useEffect(() => {
        async function fetchPosts() {
            if (
                auth.token !== null &&
                auth.privateKey !== null &&
                auth.encryptionKey !== null &&
                auth.encryptionMac !== null
            ) {
                const resp = await fetchOwnPosts(
                    auth.token,
                    auth.privateKey,
                    auth.encryptionKey,
                    auth.encryptionMac
                );
                if (resp !== null) {
                    setPosts(resp);
                }
            }
        }
        fetchPosts();
    }, [auth.token, auth.privateKey, auth.encryptionKey, auth.encryptionMac]);
    return (
        <div>
            {posts == null && <div>Loading...</div>}
            {posts != null && (
                <div>
                    {posts.length === 0 && <div>No posts found</div>}
                    {posts.map((post) => (
                        <div key={post.id} style={{ margin: "20px 0" }}>
                            <PostListItem
                                key={post.id}
                                post={{
                                    ...post,
                                    user: {
                                        ...profile,
                                        username: profile.username == null ? "" : profile.username,
                                    },
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default wrapLayout(Posts);
