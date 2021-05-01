import { History, createBrowserHistory } from "history";

export const createUniversalHistory = (): History<any> => {
    const history = createBrowserHistory();
    return history;
};

export default createUniversalHistory;
