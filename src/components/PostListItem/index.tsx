import React, { useState, useCallback } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
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
        <IconButton
            disabled={loading}
            onClick={toggleLike}
            color={isLiked ? "secondary" : undefined}
            aria-label="add to favorites"
        >
            <Badge badgeContent={likes.toString()}>
                <FavoriteIcon />
            </Badge>
        </IconButton>
    );
};

const PostListItem: React.FunctionComponent<{ routing: boolean; post: PostResource }> = (props) => {
    const { post, routing } = props;
    const history = useHistory();
    const secondary =
        post.user.first_name != null ? (
            <Typography component="span" variant="body2" color="textPrimary">
                {`${post.user.username} ${fromNow(new Date(post.created_at))}`}
            </Typography>
        ) : (
            fromNow(new Date(post.created_at))
        );
    return (
        <Card style={{ margin: "5px" }}>
            <CardHeader
                avatar={<UserAvatar user={post.user} />}
                title={getPrimaryText(post.user)}
                subheader={secondary}
            />
            {post.media_content != null && (
                <CardMedia>
                    <img
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                        src={post.media_content}
                        alt={post.text_content || "Post"}
                    />
                </CardMedia>
            )}
            <CardContent
                onClick={() =>
                    history.push({ pathname: `/post/${post.id}`, state: routing ? post : null })
                }
            >
                <Typography variant="body2" component="p">
                    {post.text_content}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <PostLikedButton post={post} />
            </CardActions>
        </Card>
    );
};

export default PostListItem;
