import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "react-router-dom";

import { configureStore } from "./store";
import { initialState } from "./store/app/reducer";
import App from "./App";
import createHistory from "./store/history";
import { Store } from "redux";
import { RootState } from "./store/types";
import "./index.scss";

const history = createHistory();

// Create/use the store
// history MUST be passed here if you want syncing between server on initial route
const store: Store<RootState> = configureStore({
    initialState: { app: initialState },
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router history={history}>
                <HelmetProvider>
                    <App />
                </HelmetProvider>
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

if (process.env.NODE_ENV === "development") {
    if ((module as any).hot) {
        (module as any).hot.accept();
    }

    if (!window.store) {
        window.store = store;
    }
}
