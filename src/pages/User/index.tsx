import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import { useSelector } from "react-redux";
import { Redirect, useLocation, useParams } from "react-router";
import { fetchUserInfo, fetchUserPosts, followUser, PostResource, UserInfo } from "../../api/user";
import { wrapLayout } from "../../components/Layout";
import { getAuth, getProfile } from "../../store/app/selectors";
import UserListItem, { UserListItemUserProps } from "../../components/UserListItem";

const User = () => {
    const params: any = useParams();
    const location = useLocation<UserListItemUserProps | undefined>();
    const auth = useSelector(getAuth);
    const profile = useSelector(getProfile);
    const ownProfile = params.username === profile.username;
    const [loaded, setLoaded] = useState<boolean>(false);
    const [posts, setPosts] = useState<Array<PostResource> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(
        location.state == null
            ? null
            : {
                  is_approved: true,
                  is_following: true,
                  public_key: null,
                  ...location.state,
              }
    );
    useEffect(() => {
        async function fetchPosts() {
            if (
                auth.token !== null &&
                auth.privateKey !== null &&
                profile.isLoaded &&
                ownProfile === false
            ) {
                const resp = await fetchUserPosts(auth.token, params.username, auth.privateKey);
                if (resp !== null) {
                    setPosts(resp);
                }
            }
        }
        async function fetchInfo() {
            if (
                auth.token !== null &&
                auth.privateKey != null &&
                profile.isLoaded &&
                ownProfile === false
            ) {
                const userInfo = await fetchUserInfo(auth.token, auth.privateKey, params.username);
                setLoaded(true);
                if (userInfo !== null) {
                    setUserInfo(userInfo);
                    if (userInfo.is_approved) {
                        fetchPosts();
                    }
                }
            }
        }
        fetchInfo();
    }, [auth.token, params.username, auth.privateKey, ownProfile, profile.isLoaded]);
    const followHandler = useCallback(() => {
        if (
            auth.token !== null &&
            userInfo != null &&
            userInfo.public_key != null &&
            auth.symKey != null
        ) {
            followUser(auth.token, params.username, userInfo.public_key, auth.symKey);
        }
    }, [auth.token, userInfo, auth.symKey, params.username]);
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
                                <button onClick={followHandler}>Follow</button>
                            )}
                            {!userInfo.is_approved && <span>Not Approved Yet</span>}
                        </React.Fragment>
                    )}
                </UserListItem>
            </List>
            {posts == null && <div>Loading...</div>}
            {userInfo.is_approved && posts != null && (
                <div>
                    {posts.length === 0 && <div>No posts found</div>}
                    {posts.map((post) => (
                        <div key={post.id} style={{ margin: "20px 0" }}>
                            <UserListItem user={post.user}>
                                <div style={{ marginLeft: "10px" }}>
                                    {post.text_content !== null && post.text_content.toString()}
                                </div>
                            </UserListItem>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default wrapLayout(User);
