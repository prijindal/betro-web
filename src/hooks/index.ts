import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, getGroup, getCount, getProfile } from "../store/app/selectors";
import { fetchGroups } from "../api/group";
import {
    groupsLoaded,
    countLoaded,
    profileLoaded,
    profilePictureLoaded,
} from "../store/app/actions";
import {
    ApprovalResponse,
    fetchCounts,
    fetchFollowees,
    fetchFollowers,
    fetchPendingApprovals,
    FolloweeResponse,
    FollowerResponse,
} from "../api/account";
import throttle from "lodash/throttle";
import { fetchProfilePicture, whoAmi } from "../api/login";
import { bufferToImageUrl } from "../util/bufferToImage";
import { fetchUserSettings, UserSettingResponse } from "../api/settings";
import { UserListItemUserProps } from "../components/UserListItem";
import {
    FeedPageInfo,
    fetchHomeFeed,
    fetchUserInfo,
    fetchUserPosts,
    followUser,
    PostResource,
    UserInfo,
} from "../api/user";
import { createPaginatedHook } from "./paginated";

export function useFetchGroupsHook() {
    const auth = useSelector(getAuth);
    const groupData = useSelector(getGroup);
    const dispatch = useDispatch();
    const refreshGroup = useCallback(
        (forceLoad: boolean = false) => {
            if (auth.token !== null && (!groupData.isLoaded || forceLoad)) {
                fetchGroups(auth.token).then((resp) => {
                    if (resp !== null) {
                        dispatch(groupsLoaded(resp));
                    }
                });
            }
        },
        [auth.token, dispatch, groupData.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(refreshGroup, 2000), []);
}

export function useFetchCountHook() {
    const auth = useSelector(getAuth);
    const countData = useSelector(getCount);
    const dispatch = useDispatch();
    const refreshCount = useCallback(
        async (forceLoad: boolean = false) => {
            if (auth.token !== null && (!countData.isLoaded || forceLoad)) {
                const resp = await fetchCounts(auth.token);
                if (resp !== null) {
                    dispatch(countLoaded(resp));
                }
            }
        },
        [auth.token, dispatch, countData.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(refreshCount, 5000), []);
}

export function useFetchWhoami() {
    const auth = useSelector(getAuth);
    const profile = useSelector(getProfile);
    const dispatch = useDispatch();
    const fetchWhoami = useCallback(
        (forceLoad: boolean = false, sym_key: string | null = null) => {
            if (sym_key == null) {
                sym_key = auth.symKey;
            }
            if (
                auth.isLoaded &&
                auth.token != null &&
                (profile.isLoaded === false || forceLoad) &&
                auth.privateKey !== null &&
                sym_key != null
            ) {
                whoAmi(auth.token, sym_key).then(async (resp) => {
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
        [dispatch, auth.token, auth.symKey, auth.isLoaded, auth.privateKey, profile.isLoaded]
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
            if (
                auth.isLoaded &&
                auth.token !== null &&
                auth.symKey !== null &&
                (profile.isProfilePictureLoaded === false || forceLoad)
            ) {
                fetchProfilePicture(auth.token, auth.symKey).then(async (resp) => {
                    dispatch(profilePictureLoaded(resp == null ? null : bufferToImageUrl(resp)));
                });
            }
        },
        [dispatch, auth.isLoaded, auth.token, auth.symKey, profile.isProfilePictureLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(getProfilePicture, 2000), []);
}

export function useFetchUserSettings() {
    const auth = useSelector(getAuth);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [settings, setUserSettings] = useState<Array<UserSettingResponse> | null>(null);
    const getUserSettings = useCallback(async () => {
        if (auth.token !== null) {
            const resp = await fetchUserSettings(auth.token);
            setLoaded(true);
            if (resp !== null) {
                setUserSettings(resp);
            }
        }
    }, [auth.token]);
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
    const auth = useSelector(getAuth);
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
            if (auth.token !== null && auth.privateKey !== null && profile.isLoaded) {
                setPostsLoading(true);
                const resp = await fetchUserPosts(auth.token, username, auth.privateKey);
                setPostsLoading(false);
                if (resp !== null) {
                    setPosts(resp);
                }
            }
        }
        async function fetchInfo() {
            if (auth.token !== null && auth.privateKey != null && profile.isLoaded) {
                const userInfo = await fetchUserInfo(auth.token, auth.privateKey, username);
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
    }, [auth.token, username, auth.privateKey, profile.isLoaded]);
    return {
        fetch: fetchUser,
        loaded,
        posts,
        userInfo,
        postsLoading,
    };
};

export const useFollowUserHook = (username?: string, public_key?: string | null) => {
    const auth = useSelector(getAuth);
    const followHandler = useCallback(async () => {
        if (auth.token !== null && auth.symKey != null && username != null && public_key != null) {
            return followUser(auth.token, username, public_key, auth.symKey);
        }
    }, [auth.token, username, public_key, auth.symKey]);
    return followHandler;
};

export const useFetchHomeFeed = () => {
    const auth = useSelector(getAuth);
    const [response, setResponse] = useState<Array<PostResource> | null>(null);
    const [pageInfo, setPageInfo] = useState<FeedPageInfo | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const getResponse = useCallback(
        async (forceRefresh: boolean = false) => {
            const after = pageInfo == null || forceRefresh ? undefined : pageInfo.after;
            if (auth.token !== null && auth.privateKey !== null) {
                const resp = await fetchHomeFeed(auth.token, auth.privateKey, after);
                setLoaded(true);
                if (resp !== null) {
                    setPageInfo(resp.pageInfo);
                    if (response == null || forceRefresh) {
                        setResponse(resp.data);
                    } else {
                        setResponse([...response, ...resp.data]);
                    }
                }
            }
        },
        [auth.token, auth.privateKey, pageInfo, response]
    );
    return {
        fetch: getResponse,
        response,
        pageInfo,
        loaded,
    };
};

export const useFetchApprovals = createPaginatedHook<ApprovalResponse>(fetchPendingApprovals);
export const useFetchFollowers = createPaginatedHook<FollowerResponse>(fetchFollowers);
export const useFetchFollowees = createPaginatedHook<FolloweeResponse>(fetchFollowees);
