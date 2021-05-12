import React from "react";
import { GroupState } from "../../store/app/types";

const GroupSelect: React.FunctionComponent<{
    disabled?: boolean;
    groupId: string;
    setGroupId: (e: string) => void;
    groupData: GroupState;
    className?: string;
    styleType?: "solid" | "underline";
}> = ({ disabled, groupId, setGroupId, groupData, className, styleType }) => {
    const underlineStyles = `block w-32 mt-0 px-0.5 border-0 border-b-2 border-purple-200 focus:ring-0 focus:border-purple-500 ${className}`;
    const solidStyles = `block w-32 mt-1 rounded-md bg-purple-100 border-transparent focus:border-purple-500 focus:bg-white focus:ring-0 ${className}`;
    return (
        <select
            disabled={disabled}
            value={groupId}
            onChange={(e) => setGroupId(e.target.value as string)}
            className={styleType === "solid" ? solidStyles : underlineStyles}
        >
            {groupData.data.map((g) => (
                <option key={g.id} value={g.id}>
                    {g.name}
                </option>
            ))}
        </select>
    );
};

export default GroupSelect;
