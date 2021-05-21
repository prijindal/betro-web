import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { wrapLayout } from "../../components/Layout";
import { getGroup } from "../../store/app/selectors";
import { useFetchGroupsHook, useFetchCountHook } from "../../hooks";
import NewGroupForm from "./NewGroupForm";
import GroupComponent from "./GroupComponent";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";

const Groups = () => {
    const groupData = useSelector(getGroup);
    const fetchGroups = useFetchGroupsHook();
    const fetchCount = useFetchCountHook();
    const handleNewGroup = useCallback(() => {
        fetchGroups(true);
        fetchCount(true);
    }, [fetchCount, fetchGroups]);
    useEffect(() => {
        fetchGroups(true);
    }, [fetchGroups]);
    if (groupData.isLoaded === false) {
        return <LoadingSpinnerCenter />;
    }
    if (groupData.data === null) {
        return <div>Some error</div>;
    }
    return (
        <ul>
            {groupData.data.length === 0 && <div>No Groups</div>}
            {groupData.data.map((a) => (
                <GroupComponent key={a.id} group={a} />
            ))}
            <NewGroupForm
                onCreated={handleNewGroup}
                isDefault={groupData.data.filter((a) => a.is_default).length === 0}
            />
        </ul>
    );
};

export default wrapLayout(Groups);
