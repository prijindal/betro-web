import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApprovalResponse, fetchPendingApprovals, approveUser } from "../../api/account";
import { wrapLayout } from "../../components/Layout";
import { getAuth, getGroup } from "../../store/app/selectors";
import { useFetchGroupsHook } from "../../util/customHooks";

const Approvals = () => {
    const auth = useSelector(getAuth);
    const groupData = useSelector(getGroup);
    const dispatch = useDispatch();
    const [groupId, setGroupId] = useState<string>("");
    const [loaded, setLoaded] = useState<boolean>(false);
    const [approvals, setApprovals] = useState<Array<ApprovalResponse> | null>(null);
    const fetchGroups = useFetchGroupsHook();
    useEffect(() => {
        fetchGroups();
        if (groupData.isLoaded) {
            const defaultGroup = groupData.data.find((a) => a.is_default);
            if (defaultGroup != null) {
                setGroupId(defaultGroup.id);
            }
        }
        async function fetchApprovals() {
            if (auth.token !== null) {
                const resp = await fetchPendingApprovals(auth.token);
                setLoaded(true);
                if (resp !== null) {
                    setApprovals(resp);
                }
            }
        }
        fetchApprovals();
    }, [auth.token, dispatch, groupData, fetchGroups]);
    const approveHandler = (followId: string, publicKey: string) => {
        if (auth.token !== null && auth.encryptionKey !== null && auth.encryptionMac !== null) {
            const group = groupData.data.find((a) => a.id === groupId);
            if (group !== undefined) {
                approveUser(
                    auth.token,
                    followId,
                    publicKey,
                    groupId,
                    auth.encryptionKey,
                    auth.encryptionMac,
                    group?.sym_key
                );
            }
        }
    };
    if (loaded === false || groupData.isLoaded === false) {
        return <div>Loading</div>;
    }
    if (approvals === null) {
        return <div>Some error</div>;
    }
    return (
        <div>
            {approvals.length === 0 && <div>No Approvals</div>}
            {approvals.map((a) => (
                <div key={a.id}>
                    <span>{a.username}</span>
                    <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                        {groupData.data.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => approveHandler(a.id, a.public_key)}>Approve</button>
                </div>
            ))}
        </div>
    );
};

export default wrapLayout(Approvals);
