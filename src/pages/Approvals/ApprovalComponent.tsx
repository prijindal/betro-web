import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, ListItem, Typography, Select, MenuItem, ListItemText } from "@material-ui/core";
import { isEmpty } from "lodash";
import { ApprovalResponse, approveUser } from "../../api/account";
import { getAuth, getGroup } from "../../store/app/selectors";

const ApprovalComponent: React.FunctionComponent<{
    approval: ApprovalResponse;
    onApproved: () => void;
}> = (props) => {
    const { approval, onApproved } = props;
    const [groupId, setGroupId] = useState<string>("");
    const groupData = useSelector(getGroup);
    useEffect(() => {
        if (isEmpty(groupId)) {
            const defaultGroup = groupData.data.find((a) => a.is_default);
            if (defaultGroup != null) {
                setGroupId(defaultGroup.id);
            }
        }
    }, [groupId, groupData]);
    const auth = useSelector(getAuth);
    const approveHandler = () => {
        if (auth.token !== null && auth.encryptionKey !== null && auth.encryptionMac !== null) {
            const group = groupData.data.find((a) => a.id === groupId);
            if (group !== undefined) {
                approveUser(
                    auth.token,
                    approval.id,
                    approval.public_key,
                    groupId,
                    auth.encryptionKey,
                    auth.encryptionMac,
                    group?.sym_key
                ).then(onApproved);
            }
        }
    };
    return (
        <ListItem>
            <ListItemText>{approval.username}</ListItemText>
            <Select value={groupId} onChange={(e) => setGroupId(e.target.value as string)}>
                {groupData.data.map((g) => (
                    <MenuItem key={g.id} value={g.id}>
                        {g.name}
                    </MenuItem>
                ))}
            </Select>
            <Button onClick={() => approveHandler()}>Approve</Button>
        </ListItem>
    );
};

export default ApprovalComponent;
