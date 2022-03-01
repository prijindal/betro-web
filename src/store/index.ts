import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose, Store } from "redux";
import createRootReducer from "./rootReducer";
import { RootState } from "./types";

type StoreParams = {
    initialState?: RootState;
    middleware?: any[];
};

export const configureStore = ({
    initialState,
    middleware = [],
}: StoreParams): Store<RootState> => {
    const devtools =
        typeof window !== "undefined" &&
        typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

    const composeEnhancers = devtools || compose;

    const store = createStore(
        createRootReducer(),
        initialState,
        composeEnhancers(applyMiddleware(...[thunk].concat(...middleware)))
    );

    return store;
};

export default configureStore;
