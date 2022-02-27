import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { getGroup, getCount, getProfile, getConversation } from "../store/app/selectors";
import {
    groupsLoaded,
    countLoaded,
    profileLoaded,
    profilePictureLoaded,
    decremenetCount,
    incrementCount,
    openConversation,
    loadConversations,
    addConversation,
    loadMessages,
    addMessage,
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
    MessageResponse,
    PaginatedResponse,
} from "@betro/client";
import throttle from "lodash/throttle";
import { bufferToImageUrl } from "@betro/client";
import { UserListItemUserProps } from "../components/UserListItem/types";
import { createPaginatedHook } from "./paginated";
import BetroApiObject from "../api/context";
import { ConversationResponseBackend } from "@betro/client/dist/UserResponses";

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
                  id: "",
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

export const useFollowUserHook = (id?: string, followee_key_id?: string | null) => {
    const dispatch = useDispatch();
    const followHandler = useCallback(
        async (public_key?: string | null) => {
            if (id != null && followee_key_id != null) {
                const follow = BetroApiObject.follow.followUser(id, followee_key_id, public_key);
                dispatch(incrementCount("followees"));
                return follow;
            }
        },
        [id, followee_key_id, dispatch]
    );
    return followHandler;
};

const createFeedHook = (
    fetchFunction: (after: string | undefined) => Promise<{
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
    const approveHandler = useCallback(
        (allowProfileRead = false) => {
            if (group !== undefined && approval.public_key != null && approval.own_key_id != null) {
                const ownKeyPair = BetroApiObject.auth.ecdhKeys[approval.own_key_id];
                const privateKey = approval.own_private_key || ownKeyPair.privateKey;
                const approvePromise = BetroApiObject.follow.approveUser(
                    approval.id,
                    approval.public_key,
                    group.id,
                    group.sym_key,
                    approval.own_key_id,
                    privateKey,
                    allowProfileRead
                );
                dispatch(incrementCount("followers"));
                dispatch(decremenetCount("approvals"));
                return approvePromise;
            }
        },
        [
            approval.id,
            approval.own_key_id,
            approval.own_private_key,
            approval.public_key,
            group,
            dispatch,
        ]
    );

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

export function useFetchConversations() {
    const [response, setResponse] = useState<PaginatedResponse<ConversationResponseBackend> | null>(
        null
    );
    const after = response == null ? undefined : response.after;
    const dispatch = useDispatch();
    const getResponse = useCallback(
        async (forceRefresh = false) => {
            const resp = await BetroApiObject.conversation.fetchConversations(after);
            if (resp !== null) {
                if (response == null || forceRefresh) {
                    dispatch(loadConversations(resp.data));
                    setResponse(resp);
                } else {
                    const data = [...response.data, ...resp.data];
                    setResponse({ ...resp, data: data });
                    dispatch(loadConversations(data));
                }
            }
        },
        [after, response, dispatch]
    );
    return { fetch: getResponse, after };
}

export function useFetchMessages(
    conversation_id: string,
    private_key: string | null,
    public_key: string | null
) {
    const [response, setResponse] = useState<PaginatedResponse<MessageResponse> | null>(null);
    const after = response == null ? undefined : response.after;
    // const [loaded, setLoaded] = useState<boolean>(false);
    const dispatch = useDispatch();
    const getResponse = useCallback(
        async (forceRefresh = false) => {
            if (private_key == null || public_key == null) {
                return;
            }
            const resp = await BetroApiObject.conversation.fetchMessages(
                conversation_id,
                private_key,
                public_key,
                after
            );
            if (resp !== null) {
                if (response == null || forceRefresh) {
                    setResponse(resp);
                    dispatch(loadMessages(conversation_id, { ...resp, isLoaded: true }));
                } else {
                    const r = { ...resp, data: [...response.data, ...resp.data] };
                    setResponse(r);
                    dispatch(loadMessages(conversation_id, { ...r, isLoaded: true }));
                }
            }
        },
        [after, response, conversation_id, private_key, public_key, dispatch]
    );
    return {
        fetch: getResponse,
    };
}

export function useSendMessage(
    conversation_id: string,
    private_key: string | null,
    public_key: string | null
) {
    const dispatch = useDispatch();
    const getResponse = useCallback(
        async (text_content: string) => {
            if (private_key == null || public_key == null) {
                return;
            }
            const resp = await BetroApiObject.conversation.sendMessage(
                conversation_id,
                private_key,
                public_key,
                text_content
            );
            if (resp !== null) {
                dispatch(addMessage(conversation_id, { ...resp, message: text_content }));
            }
        },
        [conversation_id, private_key, public_key, dispatch]
    );
    return getResponse;
}

export function useOpenConversation(
    user_id: string | undefined,
    user_key_id: string | null | undefined
) {
    const dispatch = useDispatch();
    const createConversation = useCallback(async () => {
        if (user_id == null || user_key_id == null) {
            return;
        }
        const conversation = await BetroApiObject.conversation.createConversation(
            user_id,
            user_key_id
        );
        dispatch(addConversation(conversation));
        dispatch(openConversation(conversation.id));
    }, [user_id, user_key_id, dispatch]);
    return createConversation;
}

export function useProcessIncomingMessage() {
    const dispatch = useDispatch();
    const conversations = useSelector(getConversation);
    const processMessage = useCallback(
        async (messageResponse: MessageResponse) => {
            const { sender_id, conversation_id, id, message, created_at } = messageResponse;
            let conversation = conversations.data.find((a) => a.id === conversation_id);
            if (conversation == null) {
                conversation = await BetroApiObject.conversation.fetchConversation(conversation_id);
                dispatch(addConversation(conversation));
            }
            dispatch(openConversation(conversation_id));
            if (conversation != null) {
                const decryptedMessage = await BetroApiObject.conversation.parseMessage(
                    conversation,
                    message
                );
                if (decryptedMessage != null) {
                    dispatch(
                        addMessage(conversation_id, {
                            id,
                            conversation_id,
                            sender_id: sender_id,
                            message: decryptedMessage,
                            created_at,
                        })
                    );
                }
            }
        },
        [conversations.data, dispatch]
    );
    return processMessage;
}
