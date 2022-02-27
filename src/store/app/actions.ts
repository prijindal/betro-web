import { CountResponse, MessageResponse } from "@betro/client";
import { ConversationResponseBackend } from "@betro/client/dist/UserResponses";
import { Action, Group, Locale, MessagesState } from "./types";

export const ActionTypes = {
    SETLOCALE: "app/set-locale",
    AUTH_LOADED: "app/auth/loaded",
    AUTH_LOGIN: "app/login",
    AUTH_VERIFIED: "app/verified",
    AUTH_RESET: "app/reset",
    PROFILE_LOADED: "profile/loaded",
    PROFILE_PICTURE_LOADED: "profile/picture_loaded",
    GROUPS_LOADED: "group/loaded",
    COUNT_LOADED: "count/loaded",
    COUNT_INCREMENT: "count/increment",
    COUNT_DECREMENT: "count/decrement",
    CONVERSATIONS_LOADED: "conversations/loaded",
    CONVERSATIONS_ADD: "conversations/add",
    CONVERSATIONS_OPEN: "conversations/open",
    CONVERSATIONS_CLOSE: "conversations/close",
    CONVERSATIONS_SHOW: "conversations/show",
    CONVERSATIONS_HIDE: "conversations/hide",
    MESSAGES_LOADED: "messages/loaded",
    MESSAGES_ADD: "messages/add",
};

export const setLocale = (locale: Locale): Action => ({
    type: ActionTypes.SETLOCALE,
    payload: locale,
});

export const authLoaded = (isLoggedIn: boolean): Action => ({
    type: ActionTypes.AUTH_LOADED,
    payload: isLoggedIn,
});

export const loggedIn = (): Action => ({
    type: ActionTypes.AUTH_LOGIN,
});

export const resetAuth = (): Action => ({
    type: ActionTypes.AUTH_RESET,
});

export const verifedLogin = (): Action => ({
    type: ActionTypes.AUTH_VERIFIED,
});

export const profileLoaded = (
    user_id: string,
    username: string,
    email: string,
    first_name?: string,
    last_name?: string
): Action => ({
    type: ActionTypes.PROFILE_LOADED,
    payload: {
        user_id,
        username,
        email,
        first_name,
        last_name,
    },
});

export const profilePictureLoaded = (profile_picture: string | null): Action => ({
    type: ActionTypes.PROFILE_PICTURE_LOADED,
    payload: {
        profile_picture,
    },
});

export const groupsLoaded = (groups: Array<Group>): Action => ({
    type: ActionTypes.GROUPS_LOADED,
    payload: groups,
});

export const countLoaded = (count: CountResponse): Action => ({
    type: ActionTypes.COUNT_LOADED,
    payload: count,
});

export const incrementCount = (field: keyof CountResponse): Action => ({
    type: ActionTypes.COUNT_INCREMENT,
    payload: field,
});

export const decremenetCount = (field: keyof CountResponse): Action => ({
    type: ActionTypes.COUNT_DECREMENT,
    payload: field,
});

export const loadConversations = (conversations: Array<ConversationResponseBackend>): Action => ({
    type: ActionTypes.CONVERSATIONS_LOADED,
    payload: conversations,
});

export const addConversation = (conversation: ConversationResponseBackend): Action => ({
    type: ActionTypes.CONVERSATIONS_ADD,
    payload: conversation,
});

export const openConversation = (conversation_id: string): Action => ({
    type: ActionTypes.CONVERSATIONS_OPEN,
    payload: conversation_id,
});

export const closeConversation = (conversation_id: string): Action => ({
    type: ActionTypes.CONVERSATIONS_CLOSE,
    payload: conversation_id,
});

export const showConversation = (conversation_id: string): Action => ({
    type: ActionTypes.CONVERSATIONS_SHOW,
    payload: conversation_id,
});

export const hideConversation = (conversation_id: string): Action => ({
    type: ActionTypes.CONVERSATIONS_HIDE,
    payload: conversation_id,
});

export const loadMessages = (conversation_id: string, messages: MessagesState) => ({
    type: ActionTypes.MESSAGES_LOADED,
    payload: { conversation_id, messages },
});

export const addMessage = (conversation_id: string, message: MessageResponse) => ({
    type: ActionTypes.MESSAGES_ADD,
    payload: { conversation_id, message },
});
