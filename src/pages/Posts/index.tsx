import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import throttle from "lodash/throttle";
import { wrapLayout } from "../../components/Layout";
import Button from "../../ui/Button";
import { getProfile } from "../../store/app/selectors";
import PostListItem from "../../components/PostListItem";
import { useFetchOwnFeed } from "../../hooks";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";

const Posts = () => {
    const { fetch, response, pageInfo, loaded } = useFetchOwnFeed();
    const profile = useSelector(getProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchThrottled = useCallback(throttle(fetch, 2000), []);
    useEffect(() => {
        fetchThrottled();
    }, [fetchThrottled]);
    if (!loaded) {
        return <LoadingSpinnerCenter />;
    }
    if (response == null) {
        return <div>Some error occurred</div>;
    }
    return (
        <div>
            {response == null && <LoadingSpinnerCenter />}
            {response != null && (
                <ul>
                    {response.length === 0 && <div>No posts found</div>}
                    {response.map((post) => (
                        <div className="mx-4 my-0" key={post.id}>
                            <PostListItem
                                key={post.id}
                                routing={false}
                                post={{
                                    ...post,
                                    user: {
                                        ...profile,
                                        username: profile.username == null ? "" : profile.username,
                                    },
                                }}
                            />
                        </div>
                    ))}
                    {pageInfo != null && pageInfo.next && (
                        <Button aria-label="Load more" onClick={() => fetch()}>
                            Load More (Loaded {response.length} out of {pageInfo.total})
                        </Button>
                    )}
                </ul>
            )}
        </div>
    );
};

export default wrapLayout(Posts);
