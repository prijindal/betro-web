import React, { useState, useCallback } from "react";
import Divider from "../Divider";
import HeartIcon from "@heroicons/react/solid/HeartIcon";
import HeartOutlineIcon from "@heroicons/react/outline/HeartIcon";
import { LikeResponse, PostResource } from "betro-js-client";
import { UserAvatar } from "../UserListItem/UserAvatar";
import { getPrimaryText } from "../UserListItem/getPrimaryText";
import { fromNow } from "../../util/fromNow";
import { useHistory } from "react-router-dom";
import BetroApiObject from "../../api/context";
import Button from "../Button";

const PostLikedButton: React.FunctionComponent<{ post: PostResource }> = (props) => {
    const { post } = props;
    const [isLiked, setIsLiked] = useState<boolean>(post.is_liked);
    const [likes, setLikes] = useState<number>(post.likes);
    const [loading, setLoading] = useState<boolean>(false);
    const toggleLike = useCallback(async () => {
        let likeResponse: LikeResponse | null = null;
        setIsLiked(!isLiked);
        setLoading(true);
        if (isLiked) {
            likeResponse = await BetroApiObject.post.unlike(post.id);
        } else {
            likeResponse = await BetroApiObject.post.like(post.id);
        }
        setLoading(false);
        if (likeResponse != null && likeResponse.likes != null) {
            setLikes(likeResponse.likes);
        }
    }, [isLiked, post.id]);
    return (
        <Button
            outlined
            color={isLiked ? "purple" : "gray"}
            noBorder
            noHoverBg
            className={`flex flex-row item-center`}
            disabled={loading}
            onClick={toggleLike}
            aria-label="add to favorites"
        >
            {isLiked ? (
                <HeartIcon className="heroicon" />
            ) : (
                <HeartOutlineIcon className="heroicon" />
            )}
            <span className="ml-1 text-base">{likes.toString()}</span>
        </Button>
    );
};

const PostListItem: React.FunctionComponent<{ routing: boolean; post: PostResource }> = (props) => {
    const { post, routing } = props;
    const history = useHistory();
    const secondary =
        post.user.first_name != null
            ? `@${post.user.username} ${fromNow(new Date(post.created_at))}`
            : fromNow(new Date(post.created_at));
    const onClickHandler = routing
        ? () => history.push({ pathname: `/post/${post.id}`, state: post })
        : () => null;
    return (
        <div className="my-2 max-w-xl">
            <div className="flex flex-row p-4">
                <UserAvatar user={post.user} />
                <div className="flex flex-col justify-center ml-4">
                    <div className="font-medium text-gray-900 text-sm">
                        {getPrimaryText(post.user)}
                    </div>
                    <div className="font-normal text-gray-500 text-sm">{secondary}</div>
                </div>
            </div>
            {post.media_content != null && (
                <div className="p-4" onClick={onClickHandler}>
                    <img
                        className="max-w-xl max-h-48"
                        src={post.media_content}
                        alt={post.text_content || "Post"}
                    />
                </div>
            )}
            <div className="p-4" onClick={onClickHandler}>
                <div className="font-normal text-gray-900 text-sm">{post.text_content}</div>
            </div>
            <div className="p-2 flex flex-row items-center">
                <PostLikedButton post={post} />
            </div>
            <Divider />
        </div>
    );
};

export default PostListItem;
