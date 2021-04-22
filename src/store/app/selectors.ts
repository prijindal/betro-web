/* eslint-disable import/prefer-default-export */
import { createSelector } from "reselect";
import { RootState } from "../types";
import { AuthState, AppState, Locale, ProfileState, GroupState, Group } from "./types";

export const app = (state: RootState): AppState => state.app;

export const getLocale = createSelector([app], (app): Locale => app.locale);

export const getAuth = createSelector([app], (app): AuthState => app.auth);

export const getProfile = createSelector([app], (app): ProfileState => app.profile);

export const getGroup = createSelector([app], (app): GroupState => app.group);

export const getDefaultGroup = createSelector([app], (app): Group | undefined =>
    app.group.data.find((a) => a.is_default)
);
