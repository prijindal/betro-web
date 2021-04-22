import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import { configureStore } from "./store";
import { initialState } from "./store/app/reducer";
import App from "./App";
import { Store } from "redux";
import { RootState } from "./store/types";
import "./index.scss";

const store: Store<RootState> = configureStore({
    initialState: { app: initialState },
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <HelmetProvider>
                <App />
            </HelmetProvider>
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
    serviceWorkerRegistration.unregister();
} else if (process.env.NODE_ENV === "production") {
    serviceWorkerRegistration.register();
}
