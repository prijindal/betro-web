export type Locale = "en_US" | "de_DE";

export type LoginPayload = {
    encryptionKey: string;
    encryptionMac: string;
    token: string;
    privateKey: string;
};

export type AppState = Readonly<{
    locale: Locale;
    auth: AuthState;
    profile: ProfileState;
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
    symKey: string | null;
    token: string | null;
};

export type ProfileState = {
    isLoaded: boolean;
    user_id: string | null;
    username: string | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_picture: string | null;
};
