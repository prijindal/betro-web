import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import { getGroup } from "../../store/app/selectors";
import { useFetchFollowees, useFetchGroupsHook } from "../../util/customHooks";
import { FolloweeResponse } from "../../api/account";

const FolloweeComponent: React.FunctionComponent<{ follower: FolloweeResponse }> = (props) => {
    const { follower } = props;
    return (
        <ListItem>
            <ListItemText
                primary={follower.username}
                secondary={follower.is_approved ? "Approved" : "Waiting for approval"}
            />
        </ListItem>
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
        return <div>Loading</div>;
    }
    if (response === null) {
        return <div>Some error</div>;
    }
    return (
        <List>
            {response.total === 0 && <div>No Followees</div>}
            {response.data.map((a) => (
                <FolloweeComponent key={a.follow_id} follower={a} />
            ))}
            {response.next && (
                <Button onClick={() => fetch()}>
                    Load More (Loaded {response.data.length} out of {response.total})
                </Button>
            )}
        </List>
    );
};

export default wrapLayout(Followees);
