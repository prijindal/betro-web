import React, { useCallback, useEffect } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import PostListItem from "../../components/PostListItem";
import { useFetchHomeFeed } from "../../hooks";
import Button from "../../components/Button";

const LoadingComponent = () => (
    <div className="border border-purple-300 shadow rounded-md p-4 max-w-xl w-full">
        <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-purple-400 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-purple-400 rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-purple-400 rounded"></div>
                    <div className="h-4 bg-purple-400 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    </div>
);

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
        return <LoadingComponent />;
    }
    if (response == null) {
        return <div>Some error occurred</div>;
    }
    return (
        <React.Fragment>
            <div>
                {pageInfo != null && pageInfo.updating && response.length > 0 && (
                    <div className="p-2 bg-purple-100">
                        <span className="font-normal text-sm text-gray-700">
                            Feed is still building. The respponses might not be complete.
                        </span>
                        <Button onClick={() => fetch(true)} outlined>
                            Refresh
                        </Button>
                    </div>
                )}
                {response.length === 0 && (
                    <div>
                        No posts found.{" "}
                        {pageInfo != null && pageInfo.updating ? (
                            <span>
                                Feed is still building{" "}
                                <Button onClick={() => fetch(true)} outlined>
                                    Refresh
                                </Button>
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
                    <div ref={sentryRef}>
                        <LoadingComponent />
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default wrapLayout(App);
