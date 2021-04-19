import { createBrowserHistory } from "history";

type HistoryParams = {
    initialEntries?: any[];
};

export const createUniversalHistory = ({ initialEntries = [] }: HistoryParams = {}) => {
    const history = window.browserHistory || createBrowserHistory();
    if (process.env.NODE_ENV === "development" && !window.browserHistory) {
        window.browserHistory = history;
    }
    return history;
};

export default createUniversalHistory;
