/* eslint-disable import/prefer-default-export */
import { ConversationResponseBackend } from "@betro/client/dist/UserResponses";
import { createSelector } from "reselect";
import { RootState } from "../types";
import {
    AuthState,
    AppState,
    Locale,
    ProfileState,
    GroupState,
    CountState,
    ConversationsState,
} from "./types";

export const app = (state: RootState): AppState => state.app;

export const getLocale = createSelector([app], (app): Locale => app.locale);

export const getAuth = createSelector([app], (app): AuthState => app.auth);

export const getProfile = createSelector([app], (app): ProfileState => app.profile);

export const getGroup = createSelector([app], (app): GroupState => app.group);

export const getCount = createSelector([app], (app): CountState => app.count);

export const getConversation = createSelector(
    [app],
    (app): ConversationsState => app.conversations
);

export const getOpenedConversations = createSelector(
    [app],
    (app): Array<ConversationResponseBackend & { visible: boolean }> => {
        const conversations: Array<ConversationResponseBackend & { visible: boolean }> = [];
        const openedIds = app.conversations.opened.map((a) => a.id);
        for (const conversation of app.conversations.data) {
            const isOpened = app.conversations.opened.find((a) => a.id);
            if (openedIds.indexOf(conversation.id) >= 0) {
                conversations.push({ ...conversation, visible: isOpened?.visible || false });
            }
        }
        return conversations;
    }
);
