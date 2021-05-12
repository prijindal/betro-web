import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Alert from "@material-ui/core/Alert";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import Button from "../../components/Button";
import { getGroup, getProfile } from "../../store/app/selectors";
import { useFetchApprovals, useFetchGroupsHook } from "../../hooks";
import ApprovalComponent from "./ApprovalComponent";
import { Link } from "react-router-dom";
import isEmpty from "lodash/isEmpty";

const Approvals = () => {
    const profile = useSelector(getProfile);
    const groupData = useSelector(getGroup);
    const fetchGroups = useFetchGroupsHook();
    const { fetch, response, loaded } = useFetchApprovals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchPendingApprovalsThrottled = useCallback(throttle(fetch, 2000), []);
    useEffect(() => {
        fetchGroups();
        fetchPendingApprovalsThrottled();
    }, [fetchGroups, fetchPendingApprovalsThrottled]);
    if (loaded === false || groupData.isLoaded === false) {
        return <div>Loading</div>;
    }
    if (response === null) {
        return <div>Some error</div>;
    }
    return (
        <div>
            {groupData.isLoaded && groupData.data.length === 0 && (
                <Alert severity="warning">
                    You have not created a group. Please create one under{" "}
                    <Link to="/groups">Groups</Link> to start approving user
                </Alert>
            )}
            {profile.isLoaded && isEmpty(profile.first_name) && (
                <Alert severity="warning">
                    You have not Setup your profile. Please setup under{" "}
                    <Link to="/profile">Profile</Link> to start approving user
                </Alert>
            )}
            {response.total === 0 && <div>No Approvals</div>}
            <ul>
                {response.data.map((a) => (
                    <ApprovalComponent
                        key={a.id}
                        approval={a}
                        onApproved={fetchPendingApprovalsThrottled}
                    />
                ))}
                {response.next && (
                    <Button onClick={() => fetch()}>
                        Load More (Loaded {response.data.length} out of {response.total})
                    </Button>
                )}
            </ul>
        </div>
    );
};

export default wrapLayout(Approvals);
