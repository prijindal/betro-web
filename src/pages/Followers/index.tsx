import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import { getGroup } from "../../store/app/selectors";
import { useFetchFollowers, useFetchGroupsHook } from "../../hooks";
import UserListItem from "../../components/UserListItem";
import FollowButton from "../../components/FollowButton";
import Button from "../../ui/Button";
import { FollowerResponse } from "betro-js-client";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";

const FollowerComponent: React.FunctionComponent<{
    follower: FollowerResponse;
    onFollow: () => void;
}> = (props) => {
    const { follower, onFollow } = props;
    return (
        <UserListItem user={follower}>
            <div>
                {follower.is_following ? (
                    <span className="text-sm text-black">
                        {follower.is_following_approved
                            ? "Already following"
                            : "Follow not approved"}
                    </span>
                ) : (
                    <FollowButton
                        id={follower.user_id}
                        username={follower.username}
                        onFollow={onFollow}
                    />
                )}
            </div>
        </UserListItem>
    );
};

const Followers = () => {
    const groupData = useSelector(getGroup);
    const fetchGroups = useFetchGroupsHook();
    const { fetch, response, loaded } = useFetchFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchFollowersThrottled = useCallback(throttle(fetch, 2000), []);
    useEffect(() => {
        fetchGroups();
        fetchFollowersThrottled();
    }, [fetchGroups, fetchFollowersThrottled]);
    if (loaded === false || groupData.isLoaded === false) {
        return <LoadingSpinnerCenter />;
    }
    if (response === null) {
        return <div>Some error</div>;
    }
    return (
        <ul>
            {response.total === 0 && <div>No Followers</div>}
            {response.data.map((a) => (
                <FollowerComponent key={a.follow_id} follower={a} onFollow={() => fetch(true)} />
            ))}
            {response.next && (
                <Button aria-label="Load more" onClick={() => fetch()}>
                    Load More (Loaded {response.data.length} out of {response.total})
                </Button>
            )}
        </ul>
    );
};

export default wrapLayout(Followers);
