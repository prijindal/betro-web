import { produce } from "immer";
import { ActionTypes } from "./actions";
import { Action, AppState } from "./types";

export const initialState = Object.freeze<AppState>({
    locale: "en_US",
    auth: {
        isLoaded: false,
        isVerified: false,
        isLoggedIn: false,
        encryptionKey: null,
        encryptionMac: null,
        privateKey: null,
        symKey: null,
        token: null,
    },
    profile: {
        isLoaded: false,
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
                draft.auth.encryptionKey = action.payload.encryptionKey;
                draft.auth.encryptionMac = action.payload.encryptionMac;
                draft.auth.token = action.payload.token;
                draft.auth.isLoggedIn = action.payload.token !== null;
                return draft;
            }
            case ActionTypes.AUTH_LOGIN: {
                draft.auth.isLoaded = true;
                draft.auth.isLoggedIn = true;
                draft.auth.isVerified = true;
                draft.auth.encryptionKey = action.payload.encryptionKey;
                draft.auth.encryptionMac = action.payload.encryptionMac;
                draft.auth.token = action.payload.token;
                return draft;
            }
            case ActionTypes.AUTH_RESET: {
                draft.auth.isLoaded = false;
                draft.auth.isVerified = false;
                draft.auth.encryptionKey = null;
                draft.auth.encryptionMac = null;
                draft.auth.token = null;
                draft.auth.privateKey = null;
                return draft;
            }
            case ActionTypes.AUTH_VERIFIED: {
                draft.auth.isVerified = true;
                draft.auth.isLoggedIn = true;
                draft.auth.privateKey = action.payload.privateKey;
                draft.auth.symKey = action.payload.symKey;
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
                draft.profile.profile_picture = action.payload.profile_picture;
                return draft;
            }
            case ActionTypes.GROUPS_LOADED: {
                draft.group.isLoaded = true;
                draft.group.data = action.payload;
            }
        }
    });

export default appReducer;
