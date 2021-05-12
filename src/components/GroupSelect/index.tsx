import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { GroupState } from "../../store/app/types";

const GroupSelect: React.FunctionComponent<{
    disabled?: boolean;
    groupId: string;
    setGroupId: (e: string) => void;
    groupData: GroupState;
}> = ({ disabled, groupId, setGroupId, groupData }) => {
    return (
        <Select
            disabled={disabled}
            value={groupId}
            onChange={(e) => setGroupId(e.target.value as string)}
        >
            {groupData.data.map((g) => (
                <MenuItem key={g.id} value={g.id}>
                    {g.name}
                </MenuItem>
            ))}
        </Select>
    );
};

export default GroupSelect;
