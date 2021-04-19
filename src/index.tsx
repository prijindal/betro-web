import * as React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "react-router-dom";

import { configureStore } from "./store";
import { initialState } from "./store/app/reducer";
import App from "./App";
import IntlProvider from "./i18n/IntlProvider";
import createHistory from "./store/history";

const history = createHistory();

// Create/use the store
// history MUST be passed here if you want syncing between server on initial route
const store = configureStore({
  initialState: initialState,
});

hydrate(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <IntlProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </IntlProvider>
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
