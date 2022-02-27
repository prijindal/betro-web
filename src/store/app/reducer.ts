import { produce } from "immer";
import { CountResponse } from "@betro/client";
import { ActionTypes } from "./actions";
import { Action, AppState } from "./types";

export const initialState = Object.freeze<AppState>({
    locale: "en_US",
    auth: {
        isLoaded: false,
        isVerified: false,
        isLoggedIn: false,
    },
    profile: {
        isLoaded: false,
        isProfilePictureLoaded: false,
        user_id: null,
        username: null,
        email: null,
        first_name: null,
        last_name: null,
        profile_picture: null,
    },
    group: {
        isLoaded: false,
        data: [],
    },
    count: {
        isLoaded: false,
        notifications: null,
        settings: null,
        groups: null,
        followers: null,
        followees: null,
        approvals: null,
        posts: null,
    },
    conversations: {
        isLoaded: false,
        data: [],
        opened: [],
        messages: {},
    },
});

const appReducer = (state: AppState = initialState, action: Action): AppState =>
    produce(state, (draft) => {
        switch (action.type) {
            case ActionTypes.SETLOCALE: {
                draft.locale = action.payload;
                return draft;
            }
            case ActionTypes.AUTH_LOADED: {
                draft.auth.isLoaded = true;
                draft.auth.isLoggedIn = action.payload;
                return draft;
            }
            case ActionTypes.AUTH_LOGIN: {
                draft.auth.isLoaded = true;
                draft.auth.isLoggedIn = true;
                draft.auth.isVerified = true;
                return draft;
            }
            case ActionTypes.AUTH_RESET: {
                draft = initialState;
                return draft;
            }
            case ActionTypes.AUTH_VERIFIED: {
                draft.auth.isVerified = true;
                draft.auth.isLoggedIn = true;
                return draft;
            }
            case ActionTypes.PROFILE_LOADED: {
                draft.profile.isLoaded = true;
                draft.profile.user_id = action.payload.user_id;
                draft.profile.username = action.payload.username;
                draft.profile.email = action.payload.email;
                draft.profile.first_name = action.payload.first_name;
                draft.profile.last_name = action.payload.last_name;
                return draft;
            }
            case ActionTypes.PROFILE_PICTURE_LOADED: {
                draft.profile.isProfilePictureLoaded = true;
                draft.profile.profile_picture = action.payload.profile_picture;
                return draft;
            }
            case ActionTypes.GROUPS_LOADED: {
                draft.group.isLoaded = true;
                draft.group.data = action.payload;
                return draft;
            }
            case ActionTypes.COUNT_LOADED: {
                draft.count.isLoaded = true;
                draft.count.notifications = action.payload.notifications;
                draft.count.settings = action.payload.settings;
                draft.count.groups = action.payload.groups;
                draft.count.followers = action.payload.followers;
                draft.count.followees = action.payload.followees;
                draft.count.approvals = action.payload.approvals;
                draft.count.posts = action.payload.posts;
                return draft;
            }
            case ActionTypes.COUNT_INCREMENT: {
                const count = draft.count[action.payload as keyof CountResponse];
                if (count != null) {
                    draft.count[action.payload as keyof CountResponse] = count + 1;
                } else {
                    draft.count[action.payload as keyof CountResponse] = 1;
                }
                return draft;
            }
            case ActionTypes.COUNT_DECREMENT: {
                const count = draft.count[action.payload as keyof CountResponse];
                if (count != null) {
                    draft.count[action.payload as keyof CountResponse] = count - 1;
                } else {
                    draft.count[action.payload as keyof CountResponse] = 0;
                }
                return draft;
            }
            case ActionTypes.CONVERSATIONS_LOADED: {
                draft.conversations.data = action.payload;
                draft.conversations.isLoaded = true;
                return draft;
            }
            case ActionTypes.CONVERSATIONS_ADD: {
                if (draft.conversations.data.map((a) => a.id).indexOf(action.payload.id) === -1) {
                    draft.conversations.data.push(action.payload);
                }
                return draft;
            }
            case ActionTypes.CONVERSATIONS_OPEN: {
                if (draft.conversations.opened.map((a) => a.id).indexOf(action.payload) === -1) {
                    draft.conversations.opened.push({ id: action.payload, visible: true });
                }
                return draft;
            }
            case ActionTypes.CONVERSATIONS_CLOSE: {
                if (draft.conversations.opened.map((a) => a.id).indexOf(action.payload) >= 0) {
                    draft.conversations.opened = draft.conversations.opened.filter(
                        (a) => a.id !== action.payload
                    );
                }
                return draft;
            }
            case ActionTypes.CONVERSATIONS_SHOW: {
                draft.conversations.opened = draft.conversations.opened.map((a) => ({
                    id: a.id,
                    visible: a.id === action.payload ? true : a.visible,
                }));
                return draft;
            }
            case ActionTypes.CONVERSATIONS_HIDE: {
                draft.conversations.opened = draft.conversations.opened.map((a) => ({
                    id: a.id,
                    visible: a.id === action.payload ? false : a.visible,
                }));
                return draft;
            }
            case ActionTypes.MESSAGES_LOADED: {
                draft.conversations.messages[action.payload.conversation_id] =
                    action.payload.messages;
                return draft;
            }
            case ActionTypes.MESSAGES_ADD: {
                if (draft.conversations.messages[action.payload.conversation_id] != null) {
                    draft.conversations.messages[action.payload.conversation_id].data.splice(
                        0,
                        0,
                        action.payload.message
                    );
                    draft.conversations.messages[action.payload.conversation_id].total += 1;
                }
                return draft;
            }
        }
    });

export default appReducer;
