import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import { getAuth, getGroup } from "../../store/app/selectors";
import { useFetchFollowers, useFetchGroupsHook } from "../../util/customHooks";
import { FollowerResponse } from "../../api/account";
import { followUser } from "../../api/user";
import UserListItem from "../../components/UserListItem";

const FollowerComponent: React.FunctionComponent<{ follower: FollowerResponse }> = (props) => {
    const { follower } = props;
    const auth = useSelector(getAuth);
    const followHandler = useCallback(() => {
        if (auth.token !== null && follower.public_key != null && auth.symKey != null) {
            followUser(auth.token, follower.username, follower.public_key, auth.symKey);
        }
    }, [auth.token, follower.username, follower.public_key, auth.symKey]);
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
                    <Button onClick={followHandler} aria-label="follow">
                        Follow
                    </Button>
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
