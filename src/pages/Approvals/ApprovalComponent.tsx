import React, { useState } from "react";

import UserListItem from "../../components/UserListItem";
import ConfirmDialog from "../../components/ConfirmDialog";
import Button from "../../components/Button";
import { ApprovalResponse } from "../../api";
import { useApproveUser, useGroupSelector } from "../../hooks";
import GroupSelect from "../../components/GroupSelect";

const ApprovalComponent: React.FunctionComponent<{
    approval: ApprovalResponse;
    onApproved: () => void;
}> = (props) => {
    const { approval, onApproved } = props;
    const [confirmApprove, setConfirmApprove] = useState<boolean>(false);
    const { groupId, setGroupId, groupData } = useGroupSelector();
    const approveUser = useApproveUser(
        approval,
        groupData.data.find((a) => a.id === groupId)
    );
    const approveHandler = () => {
        approveUser()?.then(onApproved);
    };
    return (
        <UserListItem user={approval}>
            <ConfirmDialog
                id={`user-approve-${approval.username}`}
                open={confirmApprove}
                handleCancel={() => setConfirmApprove(false)}
                handleConfirm={approveHandler}
                title={`Approve user ${approval.username}?`}
                description="By approving this user, you agree to allow them to see your email and name"
            />
            <GroupSelect groupId={groupId} setGroupId={setGroupId} groupData={groupData} />
            <Button onClick={() => setConfirmApprove(true)}>Approve</Button>
        </UserListItem>
    );
};

export default ApprovalComponent;
