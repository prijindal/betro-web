import React, { useState } from "react";

import UserListItem from "../../components/UserListItem";
import ConfirmDialog from "../../ui/ConfirmDialog";
import Switch from "../../ui/Switch";
import Button from "../../ui/Button";
import { ApprovalResponse } from "@betro/client";
import { useApproveUser, useGroupSelector } from "../../hooks";
import GroupSelect from "../../components/GroupSelect";

const ApprovalComponent: React.FunctionComponent<{
    approval: ApprovalResponse;
    onApproved: () => void;
}> = (props) => {
    const { approval, onApproved } = props;
    const [allowProfileRead, setAllowProfileRead] = useState<boolean>(false);
    const [confirmApprove, setConfirmApprove] = useState<boolean>(false);
    const { groupId, setGroupId, groupData } = useGroupSelector();
    const approveUser = useApproveUser(
        approval,
        groupData.data.find((a) => a.id === groupId)
    );
    const approveHandler = () => {
        approveUser(allowProfileRead)?.then(onApproved);
    };
    return (
        <UserListItem user={approval}>
            <ConfirmDialog
                id={`user-approve-${approval.username}`}
                open={confirmApprove}
                handleCancel={() => setConfirmApprove(false)}
                handleConfirm={approveHandler}
                title={`Approve user ${approval.username}?`}
                description={
                    <div>
                        <Switch
                            value={allowProfileRead}
                            onChange={setAllowProfileRead}
                            label="Allow user to see your name and profile picture"
                        />
                    </div>
                }
            />
            <GroupSelect groupId={groupId} setGroupId={setGroupId} groupData={groupData} />
            <Button aria-label="Approve" onClick={() => setConfirmApprove(true)}>
                Approve
            </Button>
        </UserListItem>
    );
};

export default ApprovalComponent;
