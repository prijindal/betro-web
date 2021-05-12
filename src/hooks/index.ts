import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { getGroup, getCount, getProfile } from "../store/app/selectors";
import {
    groupsLoaded,
    countLoaded,
    profileLoaded,
    profilePictureLoaded,
    decremenetCount,
    incrementCount,
} from "../store/app/actions";
import { Group } from "../store/app/types";
import {
    FeedPageInfo,
    PostResource,
    ApprovalResponse,
    FolloweeResponse,
    FollowerResponse,
    UserInfo,
    UserSettingResponse,
    NotificationResponse,
} from "../api";
import throttle from "lodash/throttle";
import { bufferToImageUrl } from "../util/bufferToImage";
import { UserListItemUserProps } from "../components/UserListItem/types";
import { createPaginatedHook } from "./paginated";
import BetroApiObject from "../api/context";

export function useFetchGroupsHook() {
    const groupData = useSelector(getGroup);
    const dispatch = useDispatch();
    const refreshGroup = useCallback(
        (forceLoad = false) => {
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
        async (forceLoad = false) => {
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
    const profile = useSelector(getProfile);
    const dispatch = useDispatch();
    const fetchWhoami = useCallback(
        (forceLoad = false) => {
            if (profile.isLoaded === false || forceLoad) {
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
        [dispatch, profile.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(fetchWhoami, 2000), []);
}

export function useFetchProfilePicture() {
    const profile = useSelector(getProfile);
    const dispatch = useDispatch();

    const getProfilePicture = useCallback(
        (forceLoad = false) => {
            if (profile.isProfilePictureLoaded === false || forceLoad) {
                BetroApiObject.account.fetchProfilePicture().then(async (resp) => {
                    dispatch(profilePictureLoaded(resp == null ? null : bufferToImageUrl(resp)));
                });
            }
        },
        [dispatch, profile.isProfilePictureLoaded]
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
    const [loaded, setLoaded] = useState<boolean>(false);
    const [postsLoading, setPostsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<Array<PostResource> | null>(null);
    const [pageInfo, setPageInfo] = useState<FeedPageInfo | null>(null);
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
                  username: state.username || "",
              }
    );
    const fetchPosts = useCallback(
        async (forceRefresh = false) => {
            const after = pageInfo == null || forceRefresh ? undefined : pageInfo.after;
            setPostsLoading(true);
            const resp = await BetroApiObject.feed.fetchUserPosts(username, after);
            setPostsLoading(false);
            if (resp !== null) {
                setPageInfo(resp.pageInfo);
                if (response == null || forceRefresh) {
                    setResponse(resp.data);
                } else {
                    setResponse([...response, ...resp.data]);
                }
            }
        },
        [response, username, pageInfo]
    );
    const fetchInfo = useCallback(async () => {
        const userInfo = await BetroApiObject.follow.fetchUserInfo(username);
        setLoaded(true);
        if (userInfo !== null) {
            setUserInfo(userInfo);
            if (userInfo.is_approved) {
                fetchPosts();
            }
        }
    }, [username, fetchPosts]);
    return {
        fetchInfo,
        fetchPosts,
        loaded,
        response,
        pageInfo,
        userInfo,
        postsLoading,
    };
};

export const useFollowUserHook = (username?: string, public_key?: string | null) => {
    const dispatch = useDispatch();
    const followHandler = useCallback(async () => {
        if (username != null && public_key != null) {
            const follow = BetroApiObject.follow.followUser(username, public_key);
            dispatch(incrementCount("followees"));
            return follow;
        }
    }, [username, public_key, dispatch]);
    return followHandler;
};

const createFeedHook = (
    fetchFunction: (
        after: string | undefined
    ) => Promise<{
        data: Array<PostResource>;
        pageInfo: FeedPageInfo;
    } | null>
) => {
    const useFeedHook = () => {
        const [response, setResponse] = useState<Array<PostResource> | null>(null);
        const [pageInfo, setPageInfo] = useState<FeedPageInfo | null>(null);
        const [loaded, setLoaded] = useState<boolean>(false);
        const [loading, setLoading] = useState<boolean>(false);
        const getResponse = useCallback(
            async (forceRefresh = false) => {
                const after = pageInfo == null || forceRefresh ? undefined : pageInfo.after;
                setLoading(true);
                const resp = await fetchFunction(after);
                setLoaded(true);
                setLoading(false);
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
            loading,
        };
    };

    return useFeedHook;
};

export const useGroupSelector = () => {
    const [groupId, setGroupId] = useState<string>("");
    const groupData = useSelector(getGroup);
    useEffect(() => {
        if (isEmpty(groupId)) {
            const defaultGroup = groupData.data.find((a) => a.is_default);
            if (defaultGroup != null) {
                setGroupId(defaultGroup.id);
            }
        }
    }, [groupId, groupData]);
    return {
        groupId,
        setGroupId,
        groupData,
    };
};

export const useApproveUser = (approval: ApprovalResponse, group: Group | undefined) => {
    const dispatch = useDispatch();
    const approveHandler = useCallback(() => {
        if (group !== undefined) {
            const approvePromise = BetroApiObject.follow.approveUser(
                approval.id,
                approval.public_key,
                group.id,
                group.sym_key
            );
            dispatch(incrementCount("followers"));
            dispatch(decremenetCount("approvals"));
            return approvePromise;
        }
    }, [approval.id, approval.public_key, group, dispatch]);

    return approveHandler;
};

export const useReadNotification = (notification: NotificationResponse) => {
    const dispatch = useDispatch();
    const [read, setRead] = useState<boolean>(notification.read);
    const readNotification = useCallback(async () => {
        const isRead = await BetroApiObject.notifications.readNotification(notification.id);
        if (isRead) {
            setRead(true);
            dispatch(decremenetCount("notifications"));
        }
    }, [notification.id, dispatch]);
    return {
        readNotification,
        read,
    };
};

export const useFetchHomeFeed = createFeedHook(BetroApiObject.feed.fetchHomeFeed);
export const useFetchOwnFeed = createFeedHook(BetroApiObject.feed.fetchOwnPosts);

export const useFetchApprovals = createPaginatedHook<ApprovalResponse>(
    BetroApiObject.follow.fetchPendingApprovals
);
export const useFetchFollowers = createPaginatedHook<FollowerResponse>(
    BetroApiObject.follow.fetchFollowers
);
export const useFetchFollowees = createPaginatedHook<FolloweeResponse>(
    BetroApiObject.follow.fetchFollowees
);
