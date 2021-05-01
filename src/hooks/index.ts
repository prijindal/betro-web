import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, getGroup, getCount, getProfile } from "../store/app/selectors";
import {
    groupsLoaded,
    countLoaded,
    profileLoaded,
    profilePictureLoaded,
} from "../store/app/actions";
import { ApprovalResponse, FolloweeResponse, FollowerResponse, UserInfo } from "../api/follow";
import throttle from "lodash/throttle";
import { bufferToImageUrl } from "../util/bufferToImage";
import { UserSettingResponse } from "../api/settings";
import { UserListItemUserProps } from "../components/UserListItem";
import { FeedPageInfo, PostResource } from "../api/feed";
import { createPaginatedHook } from "./paginated";
import BetroApiObject from "../api/context";

export function useFetchGroupsHook() {
    const groupData = useSelector(getGroup);
    const dispatch = useDispatch();
    const refreshGroup = useCallback(
        (forceLoad: boolean = false) => {
            if (!groupData.isLoaded || forceLoad) {
                BetroApiObject.group.fetchGroups().then((resp) => {
                    if (resp !== null) {
                        dispatch(groupsLoaded(resp));
                    }
                });
            }
        },
        [dispatch, groupData.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(refreshGroup, 2000), []);
}

export function useFetchCountHook() {
    const countData = useSelector(getCount);
    const dispatch = useDispatch();
    const refreshCount = useCallback(
        async (forceLoad: boolean = false) => {
            if (!countData.isLoaded || forceLoad) {
                const resp = await BetroApiObject.account.fetchCounts();
                if (resp !== null) {
                    dispatch(countLoaded(resp));
                }
            }
        },
        [dispatch, countData.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(refreshCount, 5000), []);
}

export function useFetchWhoami() {
    const auth = useSelector(getAuth);
    const profile = useSelector(getProfile);
    const dispatch = useDispatch();
    const fetchWhoami = useCallback(
        (forceLoad: boolean = false) => {
            if (auth.isLoaded && (profile.isLoaded === false || forceLoad)) {
                BetroApiObject.account.whoAmi().then(async (resp) => {
                    if (resp != null) {
                        dispatch(
                            profileLoaded(
                                resp.user_id,
                                resp.username,
                                resp.email,
                                resp.first_name,
                                resp.last_name
                            )
                        );
                    }
                });
            }
        },
        [dispatch, auth.isLoaded, profile.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(fetchWhoami, 2000), []);
}

export function useFetchProfilePicture() {
    const auth = useSelector(getAuth);
    const profile = useSelector(getProfile);
    const dispatch = useDispatch();

    const getProfilePicture = useCallback(
        (forceLoad: boolean = false) => {
            if (auth.isLoaded && (profile.isProfilePictureLoaded === false || forceLoad)) {
                BetroApiObject.account.fetchProfilePicture().then(async (resp) => {
                    dispatch(profilePictureLoaded(resp == null ? null : bufferToImageUrl(resp)));
                });
            }
        },
        [dispatch, auth.isLoaded, profile.isProfilePictureLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(getProfilePicture, 2000), []);
}

export function useFetchUserSettings() {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [settings, setUserSettings] = useState<Array<UserSettingResponse> | null>(null);
    const getUserSettings = useCallback(async () => {
        const resp = await BetroApiObject.settings.fetchUserSettings();
        setLoaded(true);
        if (resp !== null) {
            setUserSettings(resp);
        }
    }, []);
    return {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchUserSettings: useCallback(throttle(getUserSettings, 2000), []),
        settings,
        loaded,
    };
}

export const useFetchUserInfoHook = (
    username: string,
    state: UserListItemUserProps | undefined
) => {
    const profile = useSelector(getProfile);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [postsLoading, setPostsLoading] = useState<boolean>(false);
    const [posts, setPosts] = useState<Array<PostResource> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(
        state == null
            ? null
            : {
                  is_approved: true,
                  is_following: true,
                  public_key: null,
                  ...state,
                  profile_picture:
                      typeof state.profile_picture == "string" ? null : state.profile_picture,
              }
    );
    const fetchUser = useCallback(() => {
        async function fetchPosts() {
            if (profile.isLoaded) {
                setPostsLoading(true);
                const resp = await BetroApiObject.feed.fetchUserPosts(username);
                setPostsLoading(false);
                if (resp !== null) {
                    setPosts(resp);
                }
            }
        }
        async function fetchInfo() {
            if (profile.isLoaded) {
                const userInfo = await BetroApiObject.follow.fetchUserInfo(username);
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
    }, [username, profile.isLoaded]);
    return {
        fetch: fetchUser,
        loaded,
        posts,
        userInfo,
        postsLoading,
    };
};

export const useFollowUserHook = (username?: string, public_key?: string | null) => {
    const followHandler = useCallback(async () => {
        if (username != null && public_key != null) {
            return BetroApiObject.follow.followUser(username, public_key);
        }
    }, [username, public_key]);
    return followHandler;
};

export const useFetchHomeFeed = () => {
    const [response, setResponse] = useState<Array<PostResource> | null>(null);
    const [pageInfo, setPageInfo] = useState<FeedPageInfo | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const getResponse = useCallback(
        async (forceRefresh: boolean = false) => {
            const after = pageInfo == null || forceRefresh ? undefined : pageInfo.after;
            const resp = await BetroApiObject.feed.fetchHomeFeed(after);
            setLoaded(true);
            if (resp !== null) {
                setPageInfo(resp.pageInfo);
                if (response == null || forceRefresh) {
                    setResponse(resp.data);
                } else {
                    setResponse([...response, ...resp.data]);
                }
            }
        },
        [pageInfo, response]
    );
    return {
        fetch: getResponse,
        response,
        pageInfo,
        loaded,
    };
};

export const useFetchApprovals = createPaginatedHook<ApprovalResponse>(
    BetroApiObject.follow.fetchPendingApprovals
);
export const useFetchFollowers = createPaginatedHook<FollowerResponse>(
    BetroApiObject.follow.fetchFollowers
);
export const useFetchFollowees = createPaginatedHook<FolloweeResponse>(
    BetroApiObject.follow.fetchFollowees
);
