import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState, AuthState } from 'store/app/types';
import {
    ApprovalResponse,
    fetchPendingApprovals,
    approveUser,
    fetchGroups,
    GroupResponse,
} from 'api/account';

const Page = () => {
    const auth = useSelector<{ app: AppState }, AuthState>((a) => a.app.auth);
    const [groupId, setGroupId] = useState<string>('');
    const [loaded, setLoaded] = useState<boolean>(false);
    const [approvals, setApprovals] = useState<Array<ApprovalResponse> | null>(null);
    const [groups, setGroups] = useState<Array<GroupResponse> | null>(null);
    useEffect(() => {
        async function fetchApprovals() {
            if (auth.token !== null) {
                const resp = await fetchPendingApprovals(auth.token);
                setLoaded(true);
                if (resp !== null) {
                    setApprovals(resp);
                }
            }
        }
        async function fetchgr() {
            if (auth.token !== null) {
                const resp = await fetchGroups(auth.token);
                if (resp !== null) {
                    setGroups(resp);
                    setGroupId(resp[0].id);
                }
            }
        }
        fetchApprovals();
        fetchgr();
    }, [auth.token]);
    const approveHandler = (followId: string, publicKey: string) => {
        if (auth.token !== null && auth.encryptionKey !== null && auth.encryptionMac !== null) {
            const group = groups?.find((a) => a.id === groupId);
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
    if (loaded === false) {
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
                    <span>{a.email}</span>
                    <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                        {groups?.map((g) => (
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

export default Page;
