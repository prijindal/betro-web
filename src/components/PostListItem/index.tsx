import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { PostResource } from "../../api";
import { UserAvatar, getPrimaryText } from "../UserListItem";
import { fromNow } from "../../util/fromNow";
import { useHistory } from "react-router-dom";

const PostListItem: React.FunctionComponent<{ post: PostResource }> = (props) => {
    const { post } = props;
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
        <Card
            onClick={() => history.push({ pathname: `/post/${post.id}`, state: post })}
            style={{ margin: "5px" }}
        >
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
            <CardContent>
                <Typography variant="body2" component="p">
                    {post.text_content}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default PostListItem;
