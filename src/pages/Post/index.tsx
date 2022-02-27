import React, { useEffect, useCallback, useState } from "react";
import throttle from "lodash/throttle";
import { useParams } from "react-router";
import { PostResource } from "@betro/client";
import BetroApiObject from "../../api/context";
import { wrapLayout } from "../../components/Layout";
import PostListItem from "../../components/PostListItem";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";

const Post = () => {
    const params: any = useParams();
    const id = params.id;
    const [post, setPost] = useState<PostResource | null>(null);
    const fetchPost = useCallback(async () => {
        const post = await BetroApiObject.post.getPost(id);
        setPost(post);
    }, [id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchPostThrottled = useCallback(throttle(fetchPost, 2000), []);
    useEffect(() => {
        fetchPostThrottled();
    }, [fetchPostThrottled]);
    if (post == null) {
        return <LoadingSpinnerCenter />;
    }
    return (
        <div>
            <PostListItem routing={false} post={post} />
        </div>
    );
};

export default wrapLayout(Post);
