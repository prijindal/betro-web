import { combineReducers, Reducer } from "redux";
import app from "./app/reducer";
import { RootState } from "./types";

const createRootReducer = (): Reducer<RootState> =>
    combineReducers({
        app,
    });

export default createRootReducer;
