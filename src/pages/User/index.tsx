import React, { useEffect } from "react";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import { useSelector } from "react-redux";
import { Redirect, useLocation, useParams } from "react-router";
import { wrapLayout } from "../../components/Layout";
import { getProfile } from "../../store/app/selectors";
import UserListItem, { UserListItemUserProps } from "../../components/UserListItem";
import { useFollowUserHook, useFetchUserInfoHook } from "../../hooks";

const User = () => {
    const params: any = useParams();
    const location = useLocation<UserListItemUserProps | undefined>();
    const profile = useSelector(getProfile);
    const ownProfile = params.username === profile.username;
    const { fetch, userInfo, loaded, posts, postsLoading } = useFetchUserInfoHook(
        params.username,
        location.state
    );
    const followUser = useFollowUserHook(userInfo?.username, userInfo?.public_key);
    useEffect(() => {
        fetch();
    }, [fetch]);
    if (ownProfile) {
        return <Redirect to="/posts" />;
    }
    if (userInfo === null) {
        return <div>{loaded === true ? "User not found" : "Loading..."}</div>;
    }
    return (
        <div>
            <List>
                <UserListItem user={userInfo}>
                    {loaded === true && (
                        <React.Fragment>
                            {!userInfo.is_following && <Button onClick={followUser}>Follow</Button>}
                            {userInfo.is_following && !userInfo.is_approved && (
                                <span>Not Approved Yet</span>
                            )}
                        </React.Fragment>
                    )}
                </UserListItem>
            </List>
            {loaded && (
                <React.Fragment>
                    {postsLoading === true && <div>Loading...</div>}
                    {userInfo.is_approved && posts != null && (
                        <div>
                            {posts.length === 0 && <div>No posts found</div>}
                            {posts.map((post) => (
                                <div key={post.id} style={{ margin: "20px 0" }}>
                                    <UserListItem user={post.user}>
                                        <div style={{ marginLeft: "10px" }}>
                                            {post.text_content !== null &&
                                                post.text_content.toString()}
                                        </div>
                                    </UserListItem>
                                </div>
                            ))}
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default wrapLayout(User);
