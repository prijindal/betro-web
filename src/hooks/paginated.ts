import { useCallback, useState } from "react";
import { PaginatedResponse } from "@betro/client";

export function createPaginatedHook<T>(
    fetchApi: (after?: string) => Promise<PaginatedResponse<T> | null>
) {
    function usePaginatedApi() {
        const [response, setResponse] = useState<PaginatedResponse<T> | null>(null);
        const after = response == null ? undefined : response.after;
        const [loaded, setLoaded] = useState<boolean>(false);
        const getResponse = useCallback(
            async (forceRefresh = false) => {
                const resp = await fetchApi(after);
                setLoaded(true);
                if (resp !== null) {
                    if (response == null || forceRefresh) {
                        setResponse(resp);
                    } else {
                        setResponse({ ...resp, data: [...response.data, ...resp.data] });
                    }
                }
            },
            [after, response]
        );
        return {
            fetch: getResponse,
            response,
            loaded,
        };
    }
    return usePaginatedApi;
}
