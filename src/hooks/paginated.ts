import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { getAuth } from "../store/app/selectors";
import { PaginatedResponse } from "../api/PaginatedResponse";

export function createPaginatedHook<T>(
    fetchApi: (
        token: string,
        private_key: string,
        after?: string
    ) => Promise<PaginatedResponse<T> | null>
) {
    function usePaginatedApi() {
        const auth = useSelector(getAuth);
        const [response, setResponse] = useState<PaginatedResponse<T> | null>(null);
        const after = response == null ? undefined : response.after;
        const [loaded, setLoaded] = useState<boolean>(false);
        const getResponse = useCallback(async () => {
            if (auth.token !== null && auth.privateKey !== null) {
                const resp = await fetchApi(auth.token, auth.privateKey, after);
                setLoaded(true);
                if (resp !== null) {
                    if (response == null) {
                        setResponse(resp);
                    } else {
                        setResponse({ ...resp, data: [...response.data, ...resp.data] });
                    }
                }
            }
        }, [auth.token, auth.privateKey, after, response]);
        return {
            fetch: getResponse,
            response,
            loaded,
        };
    }
    return usePaginatedApi;
}
