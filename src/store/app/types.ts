export type Locale = 'en_US' | 'de_DE';

export type LoginPayload = {
    encryptionKey: string;
    encryptionMac: string;
    token: string;
    privateKey: string;
};

export type AppState = Readonly<{
    locale: Locale;
    auth: AuthState;
}>;

export type Action = {
    type: string;
    payload?: any;
};

export type AuthState = {
    isLoaded: boolean;
    isVerified: boolean;
    isLoggedIn: boolean;
    encryptionKey: string | null;
    encryptionMac: string | null;
    privateKey: string | null;
    token: string | null;
};
