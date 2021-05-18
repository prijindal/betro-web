import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import { getGroup } from "../../store/app/selectors";
import { useFetchFollowees, useFetchGroupsHook } from "../../hooks";
import UserListItem from "../../components/UserListItem";
import Button from "../../components/Button";
import { FolloweeResponse } from "betro-js-client";
import { LoadingSpinnerCenter } from "../../components/LoadingSpinner";

const FolloweeComponent: React.FunctionComponent<{ follower: FolloweeResponse }> = (props) => {
    const { follower } = props;
    return (
        <UserListItem user={follower} routing>
            <div>
                <span className="text-sm text-black">
                    {follower.is_approved ? "Approved" : "Waiting for approval"}
                </span>
            </div>
        </UserListItem>
    );
};

const Followees = () => {
    const groupData = useSelector(getGroup);
    const fetchGroups = useFetchGroupsHook();
    const { fetch, response, loaded } = useFetchFollowees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchFolloweesThrottled = useCallback(throttle(fetch, 2000), []);
    useEffect(() => {
        fetchGroups();
        fetchFolloweesThrottled();
    }, [fetchGroups, fetchFolloweesThrottled]);
    if (loaded === false || groupData.isLoaded === false) {
        return <LoadingSpinnerCenter />;
    }
    if (response === null) {
        return <div>Some error</div>;
    }
    return (
        <ul>
            {response.total === 0 && <div>No Followees</div>}
            {response.data.map((a) => (
                <FolloweeComponent key={a.follow_id} follower={a} />
            ))}
            {response.next && (
                <Button aria-label="Load more" onClick={() => fetch()}>
                    Load More (Loaded {response.data.length} out of {response.total})
                </Button>
            )}
        </ul>
    );
};

export default wrapLayout(Followees);
