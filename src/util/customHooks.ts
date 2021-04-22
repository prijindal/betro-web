import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, getGroup } from "../store/app/selectors";
import { fetchGroups } from "../api/group";
import { groupsLoaded } from "../store/app/actions";

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
    return refreshGroup;
}
