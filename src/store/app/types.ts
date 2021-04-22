export type Locale = "en_US" | "de_DE";

export type LoginPayload = Readonly<{
    encryptionKey: string;
    encryptionMac: string;
    token: string;
    privateKey: string;
}>;

export type AppState = Readonly<{
    locale: Locale;
    auth: AuthState;
    profile: ProfileState;
    group: GroupState;
}>;

export type Action = {
    type: string;
    payload?: any;
};

export type AuthState = Readonly<{
    isLoaded: boolean;
    isVerified: boolean;
    isLoggedIn: boolean;
    encryptionKey: string | null;
    encryptionMac: string | null;
    privateKey: string | null;
    symKey: string | null;
    token: string | null;
}>;

export type ProfileState = Readonly<{
    isLoaded: boolean;
    user_id: string | null;
    username: string | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_picture: string | null;
}>;

export type GroupState = Readonly<{
    isLoaded: boolean;
    data: Array<Group>;
}>;

export type Group = Readonly<{
    id: string;
    is_default: boolean;
    name: string;
    sym_key: string;
}>;
