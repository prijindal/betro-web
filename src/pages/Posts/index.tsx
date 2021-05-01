import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PostResource } from "../../api";
import { wrapLayout } from "../../components/Layout";
import { getProfile } from "../../store/app/selectors";
import PostListItem from "../../components/PostListItem";
import BetroApiObject from "../../api/context";

const Posts = () => {
    const [posts, setPosts] = useState<Array<PostResource> | null>(null);
    const profile = useSelector(getProfile);
    useEffect(() => {
        async function fetchPosts() {
            const resp = await BetroApiObject.feed.fetchOwnPosts();
            if (resp !== null) {
                setPosts(resp);
            }
        }
        fetchPosts();
    }, []);
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
