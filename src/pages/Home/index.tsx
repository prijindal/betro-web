import React, { useCallback, useEffect } from "react";
import Button from "@material-ui/core/Button";
import useInfiniteScroll from "react-infinite-scroll-hook";
import throttle from "lodash/throttle";
import Alert from "@material-ui/core/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { wrapLayout } from "../../components/Layout";
import PostListItem from "../../components/PostListItem";
import { useFetchHomeFeed } from "../../hooks";

const App = () => {
    const { fetch, response, pageInfo, loaded, loading } = useFetchHomeFeed();
    const [sentryRef] = useInfiniteScroll({
        loading: loading,
        hasNextPage: pageInfo != null && pageInfo.next,
        onLoadMore: fetch,
        rootMargin: "0px 0px 400px 0px",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchThrottled = useCallback(throttle(fetch, 2000), []);
    useEffect(() => {
        fetchThrottled();
    }, [fetchThrottled]);
    if (!loaded) {
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </div>
        );
    }
    if (response == null) {
        return <div>Some error occurred</div>;
    }
    return (
        <React.Fragment>
            <div>
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
                    <PostListItem routing={true} key={post.id} post={post} />
                ))}
                {(loading || (pageInfo != null && pageInfo.next)) && (
                    <div style={{ display: "flex", justifyContent: "center" }} ref={sentryRef}>
                        <CircularProgress />
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default wrapLayout(App);
