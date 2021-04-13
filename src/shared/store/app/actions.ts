import { Action, Locale, LoginPayload } from './types';

export const ActionTypes = {
    SETLOCALE: 'app/set-locale',
    AUTH_LOADED: 'app/auth/loaded',
    AUTH_LOGIN: 'app/login',
    AUTH_VERIFIED: 'app/verified',
    AUTH_RESET: 'app/reset',
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

export const verifedLogin = (privateKey: string): Action => ({
    type: ActionTypes.AUTH_VERIFIED,
    payload: privateKey,
});
