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
        token: null,
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
                draft.auth.privateKey = action.payload;
                return draft;
            }
        }
    });

export default appReducer;
