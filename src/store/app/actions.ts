import { Action, Group, Locale, LoginPayload } from "./types";

export const ActionTypes = {
    SETLOCALE: "app/set-locale",
    AUTH_LOADED: "app/auth/loaded",
    AUTH_LOGIN: "app/login",
    AUTH_VERIFIED: "app/verified",
    AUTH_RESET: "app/reset",
    PROFILE_LOADED: "profile/loaded",
    PROFILE_PICTURE_LOADED: "profile/picture_loaded",
    GROUPS_LOADED: "group/loaded",
};

export const setLocale = (locale: Locale): Action => ({
    type: ActionTypes.SETLOCALE,
    payload: locale,
});

export const authLoaded = (
    encryptionKey: string | null,
    encryptionMac: string | null,
    token: string | null
): Action => ({
    type: ActionTypes.AUTH_LOADED,
    payload: {
        encryptionKey,
        encryptionMac,
        token,
    },
});

export const loggedIn = (payload: LoginPayload): Action => ({
    type: ActionTypes.AUTH_LOGIN,
    payload,
});

export const resetAuth = (): Action => ({
    type: ActionTypes.AUTH_RESET,
});

export const verifedLogin = (privateKey: string, symKey?: string): Action => ({
    type: ActionTypes.AUTH_VERIFIED,
    payload: {
        privateKey,
        symKey,
    },
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

export const profilePictureLoaded = (profile_picture: string): Action => ({
    type: ActionTypes.PROFILE_PICTURE_LOADED,
    payload: {
        profile_picture,
    },
});

export const groupsLoaded = (groups: Array<Group>): Action => ({
    type: ActionTypes.GROUPS_LOADED,
    payload: groups,
});
