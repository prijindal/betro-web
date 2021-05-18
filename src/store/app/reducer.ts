import { produce } from "immer";
import { CountResponse } from "betro-js-client";
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
        }
    });

export default appReducer;
