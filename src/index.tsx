import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import ThemeProvider from "@material-ui/core/styles/ThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import deepPurple from "@material-ui/core/colors/deepPurple";
import { SnackbarProvider } from "notistack";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import { configureStore } from "./store";
import { initialState } from "./store/app/reducer";
import App from "./App";
import { Store } from "redux";
import { RootState } from "./store/types";
import "./index.scss";

const theme = createMuiTheme({
    palette: {
        primary: deepPurple,
    },
});

const store: Store<RootState> = configureStore({
    initialState: { app: initialState },
});

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <HelmetProvider>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider maxSnack={3}>
                        <App />
                    </SnackbarProvider>
                </ThemeProvider>
            </HelmetProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

if (process.env.NODE_ENV === "development") {
    if (module.hot) {
        module.hot.accept();
    }
    serviceWorkerRegistration.unregister();
} else if (process.env.NODE_ENV === "production") {
    serviceWorkerRegistration.unregister();
}
