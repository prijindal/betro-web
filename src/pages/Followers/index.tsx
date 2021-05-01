import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import { getGroup } from "../../store/app/selectors";
import { useFetchFollowers, useFetchGroupsHook, useFollowUserHook } from "../../hooks";
import UserListItem from "../../components/UserListItem";
import FollowButton from "../../components/FollowButton";
import { FollowerResponse } from "../../api/follow";

const FollowerComponent: React.FunctionComponent<{ follower: FollowerResponse }> = (props) => {
    const { follower } = props;
    const followHandler = useFollowUserHook(follower.username, follower.public_key);
    return (
        <UserListItem user={follower}>
            <ListItemSecondaryAction>
                {follower.is_following ? (
                    <Typography component="span" variant="body2" color="textPrimary">
                        {follower.is_following_approved
                            ? "Already following"
                            : "Follow not approved"}
                    </Typography>
                ) : (
                    <FollowButton
                        username={follower.username}
                        public_key={follower.public_key}
                        onFollow={followHandler}
                    />
                )}
            </ListItemSecondaryAction>
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
        return <div>Loading</div>;
    }
    if (response === null) {
        return <div>Some error</div>;
    }
    return (
        <List>
            {response.total === 0 && <div>No Followers</div>}
            {response.data.map((a) => (
                <FollowerComponent key={a.follow_id} follower={a} />
            ))}
            {response.next && (
                <Button onClick={() => fetch()}>
                    Load More (Loaded {response.data.length} out of {response.total})
                </Button>
            )}
        </List>
    );
};

export default wrapLayout(Followers);
