import React, { useEffect } from "react";
import List from "@material-ui/core/List";
import { useSelector } from "react-redux";
import { Redirect, useLocation, useParams } from "react-router";
import { wrapLayout } from "../../components/Layout";
import { getProfile } from "../../store/app/selectors";
import PostListItem from "../../components/PostListItem";
import UserListItem, { UserListItemUserProps } from "../../components/UserListItem";
import { useFetchUserInfoHook } from "../../hooks";
import FollowButton from "../../components/FollowButton";

const User = () => {
    const params: any = useParams();
    const location = useLocation<UserListItemUserProps | undefined>();
    const profile = useSelector(getProfile);
    const ownProfile = params.username === profile.username;
    const { fetch, userInfo, loaded, posts, postsLoading } = useFetchUserInfoHook(
        params.username,
        location.state
    );
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
                            {!userInfo.is_following && (
                                <FollowButton
                                    onFollow={() => fetch()}
                                    username={userInfo.username}
                                    public_key={userInfo.public_key}
                                />
                            )}
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
                                    <PostListItem key={post.id} post={post} />
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
