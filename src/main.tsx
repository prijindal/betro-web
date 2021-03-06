import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

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
