import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, getGroup, getCount, getProfile } from "../store/app/selectors";
import { fetchGroups } from "../api/group";
import {
    groupsLoaded,
    countLoaded,
    profileLoaded,
    profilePictureLoaded,
} from "../store/app/actions";
import {
    ApprovalResponse,
    fetchCounts,
    fetchFollowees,
    fetchFollowers,
    fetchPendingApprovals,
    FolloweeResponse,
    FollowerResponse,
} from "../api/account";
import throttle from "lodash/throttle";
import { fetchProfilePicture, whoAmi } from "../api/login";
import { bufferToImageUrl } from "./bufferToImage";
import { fetchUserSettings, UserSettingResponse } from "../api/settings";
import { PaginatedResponse } from "../api/PaginatedResponse";

export function useFetchGroupsHook() {
    const auth = useSelector(getAuth);
    const groupData = useSelector(getGroup);
    const dispatch = useDispatch();
    const refreshGroup = useCallback(
        (forceLoad: boolean = false) => {
            if (auth.token !== null && (!groupData.isLoaded || forceLoad)) {
                fetchGroups(auth.token).then((resp) => {
                    if (resp !== null) {
                        dispatch(groupsLoaded(resp));
                    }
                });
            }
        },
        [auth.token, dispatch, groupData.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(refreshGroup, 2000), []);
}

export function useFetchCountHook() {
    const auth = useSelector(getAuth);
    const countData = useSelector(getCount);
    const dispatch = useDispatch();
    const refreshCount = useCallback(
        async (forceLoad: boolean = false) => {
            if (auth.token !== null && (!countData.isLoaded || forceLoad)) {
                const resp = await fetchCounts(auth.token);
                if (resp !== null) {
                    dispatch(countLoaded(resp));
                }
            }
        },
        [auth.token, dispatch, countData.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(refreshCount, 5000), []);
}

export function useFetchWhoami() {
    const auth = useSelector(getAuth);
    const profile = useSelector(getProfile);
    const dispatch = useDispatch();
    const fetchWhoami = useCallback(
        (forceLoad: boolean = false, sym_key: string | null = null) => {
            if (
                auth.isLoaded &&
                auth.token != null &&
                (profile.isLoaded === false || forceLoad) &&
                auth.privateKey !== null
            ) {
                if (sym_key == null) {
                    sym_key = auth.symKey;
                }
                whoAmi(auth.token, sym_key).then(async (resp) => {
                    if (resp != null) {
                        dispatch(
                            profileLoaded(
                                resp.user_id,
                                resp.username,
                                resp.email,
                                resp.first_name,
                                resp.last_name
                            )
                        );
                    }
                });
            }
        },
        [dispatch, auth.token, auth.symKey, auth.isLoaded, auth.privateKey, profile.isLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(fetchWhoami, 2000), []);
}

export function useFetchProfilePicture() {
    const auth = useSelector(getAuth);
    const profile = useSelector(getProfile);
    const dispatch = useDispatch();

    const getProfilePicture = useCallback(
        (forceLoad: boolean = false) => {
            if (
                auth.isLoaded &&
                auth.token !== null &&
                auth.symKey !== null &&
                (profile.isProfilePictureLoaded === false || forceLoad)
            ) {
                fetchProfilePicture(auth.token, auth.symKey).then(async (resp) => {
                    dispatch(profilePictureLoaded(resp == null ? null : bufferToImageUrl(resp)));
                });
            }
        },
        [dispatch, auth.isLoaded, auth.token, auth.symKey, profile.isProfilePictureLoaded]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(throttle(getProfilePicture, 2000), []);
}

export function useFetchUserSettings() {
    const auth = useSelector(getAuth);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [settings, setUserSettings] = useState<Array<UserSettingResponse> | null>(null);
    const getUserSettings = useCallback(async () => {
        if (auth.token !== null) {
            const resp = await fetchUserSettings(auth.token);
            setLoaded(true);
            if (resp !== null) {
                setUserSettings(resp);
            }
        }
    }, [auth.token]);
    return {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchUserSettings: useCallback(throttle(getUserSettings, 2000), []),
        settings,
        loaded,
    };
}

function createPaginatedHook<T>(
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

export const useFetchApprovals = createPaginatedHook<ApprovalResponse>(fetchPendingApprovals);
export const useFetchFollowers = createPaginatedHook<FollowerResponse>(fetchFollowers);
export const useFetchFollowees = createPaginatedHook<FolloweeResponse>(fetchFollowees);
