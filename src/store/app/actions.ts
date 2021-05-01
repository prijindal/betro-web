import { CountResponse } from "../../api";
import { Action, Group, Locale } from "./types";

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
