import { MessageResponse, PaginatedResponse } from "betro-js-client";
import { ConversationResponseBackend } from "betro-js-client/dist/UserResponses";

export type Locale = "en_US" | "de_DE";

export type AppState = Readonly<{
    locale: Locale;
    auth: AuthState;
    profile: ProfileState;
    group: GroupState;
    count: CountState;
    conversations: ConversationsState;
}>;

export type Action = {
    type: string;
    payload?: any;
};

export type MessagesState = PaginatedResponse<MessageResponse> & { isLoaded: boolean };

export type ConversationsState = Readonly<{
    isLoaded: boolean;
    data: Array<ConversationResponseBackend>;
    opened: Array<{ id: string; visible: boolean }>;
    messages: { [k: string]: MessagesState };
}>;

export type AuthState = Readonly<{
    isLoaded: boolean;
    isVerified: boolean;
    isLoggedIn: boolean;
}>;

export type ProfileState = Readonly<{
    isLoaded: boolean;
    isProfilePictureLoaded: boolean;
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

export type CountState = Readonly<{
    isLoaded: boolean;
    notifications: number | null;
    settings: number | null;
    groups: number | null;
    followers: number | null;
    followees: number | null;
    approvals: number | null;
    posts: number | null;
}>;
