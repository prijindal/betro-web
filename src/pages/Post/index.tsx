import React, { useEffect, useCallback, useState } from "react";
import throttle from "lodash/throttle";
import { useHistory, useLocation, useParams } from "react-router";
import { PostResource } from "../../api";
import BetroApiObject from "../../api/context";
import { wrapLayout } from "../../components/Layout";
import PostListItem from "../../components/PostListItem";

const Post = () => {
    const params: any = useParams();
    const history = useHistory();
    const location = useLocation<PostResource | undefined>();
    const id = params.id;
    const [post, setPost] = useState<PostResource | null>(location.state || null);
    const fetchPost = useCallback(async () => {
        const post = await BetroApiObject.post.getPost(id);
        setPost(post);
        history.replace({});
    }, [id, history]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchPostThrottled = useCallback(throttle(fetchPost, 2000), []);
    useEffect(() => {
        fetchPostThrottled();
    }, [fetchPostThrottled]);
    if (post == null) {
        return <div>Loading..</div>;
    }
    return (
        <div>
            <PostListItem routing={false} post={post} />
        </div>
    );
};

export default wrapLayout(Post);
