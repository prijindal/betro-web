import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import MailIcon from "@heroicons/react/solid/MailIcon";
import throttle from "lodash/throttle";
import { Navigate, useParams } from "react-router";
import { wrapLayout } from "../../components/Layout";
import { getProfile } from "../../store/app/selectors";
import PostListItem from "../../components/PostListItem";
import UserListItem from "../../components/UserListItem";
import { useFetchUserInfoHook, useOpenConversation } from "../../hooks";
import FollowButton from "../../components/FollowButton";
import Button from "../../ui/Button";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";

const User = () => {
    const params: any = useParams();
    const profile = useSelector(getProfile);
    const ownProfile = params.username === profile.username;
    const { fetchInfo, fetchPosts, userInfo, loaded, response, pageInfo, postsLoading } =
        useFetchUserInfoHook(params.username, undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchInfoThrottled = useCallback(throttle(fetchInfo, 2000), []);
    const openConversation = useOpenConversation(userInfo?.id, userInfo?.public_key);
    useEffect(() => {
        fetchInfoThrottled();
    }, [fetchInfoThrottled]);
    if (ownProfile) {
        return <Navigate to="/posts" />;
    }
    if (userInfo === null) {
        return <div>{loaded === true ? "User not found" : <LoadingSpinnerCenter />}</div>;
    }
    return (
        <div>
            <ul>
                <UserListItem user={userInfo}>
                    {loaded === true && (
                        <React.Fragment>
                            <Button onClick={() => openConversation()}>
                                <MailIcon className="heroicon" />
                            </Button>
                            {!userInfo.is_following && (
                                <FollowButton
                                    onFollow={() => fetchInfo()}
                                    id={userInfo.id}
                                    username={userInfo.username}
                                />
                            )}
                            {userInfo.is_following && !userInfo.is_approved && (
                                <span>Not Approved Yet</span>
                            )}
                        </React.Fragment>
                    )}
                </UserListItem>
            </ul>
            {loaded && (
                <React.Fragment>
                    {postsLoading === true && <LoadingSpinnerCenter />}
                    {userInfo.is_approved && response != null && (
                        <ul>
                            {response.length === 0 && <div>No posts found</div>}
                            {response.map((post) => (
                                <div className="mx-4 my-0" key={post.id}>
                                    <PostListItem routing={true} key={post.id} post={post} />
                                </div>
                            ))}
                            {pageInfo != null && pageInfo.next && (
                                <Button aria-label="Load more" onClick={() => fetchPosts()}>
                                    Load More (Loaded {response.length} out of {pageInfo.total})
                                </Button>
                            )}
                        </ul>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default wrapLayout(User);
