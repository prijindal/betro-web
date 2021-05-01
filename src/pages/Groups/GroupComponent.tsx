import React, { useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { useFetchGroupsHook } from "../../hooks";
import ConfirmDialog from "../../components/ConfirmDialog";
import { Group } from "../../store/app/types";
import BetroApiObject from "../../api/context";

const GroupComponent: React.FunctionComponent<{ group: Group }> = (props) => {
    const { group } = props;
    const [confirmDeletion, setConfirmDeletion] = useState<boolean>(false);
    const fetchGroups = useFetchGroupsHook();
    const deleteGroupHandler = useCallback(() => {
        setConfirmDeletion(false);
        BetroApiObject.group.deleteGroup(group.id).then(() => fetchGroups(true));
    }, [fetchGroups, group.id]);
    return (
        <ListItem>
            <Typography variant="h5">{group.name}</Typography>
            {group.is_default && <Chip label="Default" color="primary" />}
            <Button onClick={() => setConfirmDeletion(true)}>Delete</Button>
            <ConfirmDialog
                id="groups-new-form"
                open={confirmDeletion}
                handleCancel={() => setConfirmDeletion(false)}
                handleConfirm={deleteGroupHandler}
                title={`Delete Group ${group.name}`}
                description="All Followers under this group will become unfollowed"
            />
        </ListItem>
    );
};

export default GroupComponent;
