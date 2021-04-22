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
import { fetchCounts } from "../api/account";
import { throttle } from "lodash";
import { fetchProfilePicture, whoAmi } from "../api/login";
import { bufferToImageUrl } from "./bufferToImage";
import { fetchNotificationSettings, UserNotificationSettingResponse } from "../api/settings";

export function useFetchGroupsHook() {
    const auth = useSelector(getAuth);
    const groupData = useSelector(getGroup);
    const dispatch = useDispatch();
    const refreshGroup = useCallback(
        async (forceLoad: boolean = false) => {
            if (auth.token !== null && (!groupData.isLoaded || forceLoad)) {
                const resp = await fetchGroups(auth.token);
                if (resp !== null) {
                    dispatch(groupsLoaded(resp));
                }
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

export function useFetchNotificationSettings() {
    const auth = useSelector(getAuth);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [
        notificationSettings,
        setNotificationSettings,
    ] = useState<Array<UserNotificationSettingResponse> | null>(null);
    const getNotificationSettings = useCallback(async () => {
        if (auth.token !== null) {
            const resp = await fetchNotificationSettings(auth.token);
            setLoaded(true);
            if (resp !== null) {
                setNotificationSettings(resp);
            }
        }
    }, [auth.token]);
    return {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchNotificationSettings: useCallback(throttle(getNotificationSettings, 2000), []),
        notificationSettings,
        loaded,
    };
}
