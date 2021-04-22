import React, { useEffect } from "react";
import { List } from "@material-ui/core";
import { useSelector } from "react-redux";
import { wrapLayout } from "../../components/Layout";
import { getGroup } from "../../store/app/selectors";
import { useFetchGroupsHook } from "../../util/customHooks";
import NewGroupForm from "./NewGroupForm";
import GroupComponent from "./GroupComponent";

const Groups = () => {
    const groupData = useSelector(getGroup);
    const fetchGroups = useFetchGroupsHook();
    useEffect(() => {
        fetchGroups(true);
    }, [fetchGroups]);
    if (groupData.isLoaded === false) {
        return <div>Loading</div>;
    }
    if (groupData.data === null) {
        return <div>Some error</div>;
    }
    return (
        <List>
            {groupData.data.length === 0 && <div>No Groups</div>}
            {groupData.data.map((a) => (
                <GroupComponent key={a.id} group={a} />
            ))}
            <NewGroupForm
                onCreated={() => fetchGroups(true)}
                isDefault={groupData.data.filter((a) => a.is_default).length === 0}
            />
        </List>
    );
};

export default wrapLayout(Groups);
