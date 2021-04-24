import React, { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import { useSelector } from "react-redux";
import { PostResource, fetchHomeFeed } from "../../api/user";
import { wrapLayout } from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";
import UserListItem from "../../components/UserListItem";

const App = () => {
    const [posts, setPosts] = useState<Array<PostResource> | null>(null);
    const auth = useSelector(getAuth);
    useEffect(() => {
        if (auth.token != null && auth.privateKey != null) {
            fetchHomeFeed(auth.token, auth.privateKey).then((resp) => {
                setPosts(resp);
            });
        }
    }, [auth.token, auth.privateKey]);
    if (posts == null) {
        return <div>Loading</div>;
    }
    return (
        <React.Fragment>
            <List>
                {posts.map((post) => (
                    <UserListItem key={post.id} user={post.user}>
                        <span>{post.text_content?.toString("utf-8")}</span>
                    </UserListItem>
                ))}
            </List>
        </React.Fragment>
    );
};

export default wrapLayout(App);
