import React, { useCallback, useEffect } from "react";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import { wrapLayout } from "../../components/Layout";
import PostListItem from "../../components/PostListItem";
import { useFetchHomeFeed } from "../../hooks";
import throttle from "lodash/throttle";
import Alert from "@material-ui/core/Alert";

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
    return (
        <React.Fragment>
            <List>
                {pageInfo != null && pageInfo.updating && response.length > 0 && (
                    <Alert severity="info">
                        Feed is still building. The responses might not be complete
                        <Button onClick={() => fetch(true)}>Refresh</Button>
                    </Alert>
                )}
                {response.length === 0 && (
                    <div>
                        No posts found.{" "}
                        {pageInfo != null && pageInfo.updating ? (
                            <span>
                                Feed is still building{" "}
                                <Button onClick={() => fetch(true)}>Refresh</Button>
                            </span>
                        ) : (
                            "Follow more users to build your feed"
                        )}
                    </div>
                )}
                {response.map((post) => (
                    <PostListItem key={post.id} post={post} />
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
