import React, { useState, useCallback } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { LikeResponse, PostResource } from "../../api";
import { UserAvatar, getPrimaryText } from "../UserListItem";
import { fromNow } from "../../util/fromNow";
import { useHistory } from "react-router-dom";
import BetroApiObject from "../../api/context";

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
        <button
            className={`p-2 flex flex-row item-center ${
                isLiked ? "text-purple-500" : "text-gray-500"
            }`}
            disabled={loading}
            onClick={toggleLike}
            aria-label="add to favorites"
        >
            <FavoriteIcon />
            <span className="ml-1 text-base">{likes.toString()}</span>
        </button>
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
        <Card style={{ margin: "5px" }}>
            <div className="flex flex-row p-5">
                <UserAvatar user={post.user} />
                <div className="flex flex-col justify-center ml-4">
                    <div className="font-medium text-gray-900 text-sm">
                        {getPrimaryText(post.user)}
                    </div>
                    <div className="font-normal text-gray-500 text-sm">{secondary}</div>
                </div>
            </div>
            {post.media_content != null && (
                <CardMedia onClick={onClickHandler}>
                    <img
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                        src={post.media_content}
                        alt={post.text_content || "Post"}
                    />
                </CardMedia>
            )}
            <CardContent onClick={onClickHandler}>
                <div className="font-normal text-gray-900 text-sm">{post.text_content}</div>
            </CardContent>
            <CardActions disableSpacing>
                <PostLikedButton post={post} />
            </CardActions>
        </Card>
    );
};

export default PostListItem;
