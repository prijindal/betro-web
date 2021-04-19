import { AppState } from "./app/types";

export type RootState = Readonly<{
    app: AppState;
}>;
