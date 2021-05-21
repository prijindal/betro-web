import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import Button from "../../ui/Button";
import { getGroup, getProfile } from "../../store/app/selectors";
import { useFetchApprovals, useFetchGroupsHook } from "../../hooks";
import ApprovalComponent from "./ApprovalComponent";
import { Link } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";

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
        return <LoadingSpinnerCenter />;
    }
    if (response === null) {
        return <div>Some error</div>;
    }
    return (
        <div>
            {groupData.isLoaded && groupData.data.length === 0 && (
                <div className="p-2 bg-purple-100">
                    <span className="font-normal text-sm text-gray-700">
                        You have not created a group. Please create one under{" "}
                        <Link to="/groups">Groups</Link> to start approving user
                    </span>
                </div>
            )}
            {profile.isLoaded && isEmpty(profile.first_name) && (
                <div className="p-2 bg-purple-100">
                    <span className="font-normal text-sm text-gray-700">
                        You have not Setup your profile. Please setup under{" "}
                        <Link to="/profile">Profile</Link> to start approving user
                    </span>
                </div>
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
                    <Button aria-label="Load more" onClick={() => fetch()}>
                        Load More (Loaded {response.data.length} out of {response.total})
                    </Button>
                )}
            </ul>
        </div>
    );
};

export default wrapLayout(Approvals);
