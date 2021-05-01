import React from "react";
import { PostResource } from "../../api";
import UserListItem from "../UserListItem";

const PostListItem: React.FunctionComponent<{ post: PostResource }> = (props) => {
    const { post } = props;
    return (
        <UserListItem user={post.user}>
            <span>{post.text_content}</span>
            {post.media_content != null && (
                <img
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    src={post.media_content}
                    alt={post.text_content || "Post"}
                />
            )}
        </UserListItem>
    );
};

export default PostListItem;
