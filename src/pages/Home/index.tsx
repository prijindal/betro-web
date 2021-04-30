import React, { useCallback, useEffect } from "react";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import { wrapLayout } from "../../components/Layout";
import UserListItem from "../../components/UserListItem";
import { useFetchHomeFeed } from "../../hooks";
import { throttle } from "lodash";

const App = () => {
    const { fetch, response, pageInfo, loaded } = useFetchHomeFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchThrottled = useCallback(throttle(fetch, 2000), []);
    useEffect(() => {
        fetchThrottled();
    }, [fetchThrottled]);
    if (!loaded) {
        return <div>Loading</div>;
    }
    if (response == null) {
        return <div>Some error occurred</div>;
    }
    console.log(pageInfo);
    return (
        <React.Fragment>
            <List>
                {response.length === 0 && <div>No posts found. Maybe feed is still building</div>}
                {response.map((post) => (
                    <UserListItem key={post.id} user={post.user}>
                        <span>{post.text_content?.toString("utf-8")}</span>
                    </UserListItem>
                ))}
                {pageInfo != null && pageInfo.next && (
                    <Button onClick={() => fetch()}>
                        Load More (Loaded {response.length} out of {pageInfo.total})
                    </Button>
                )}
            </List>
        </React.Fragment>
    );
};

export default wrapLayout(App);
