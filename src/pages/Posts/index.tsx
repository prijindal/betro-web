import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import throttle from "lodash/throttle";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import { wrapLayout } from "../../components/Layout";
import { getProfile } from "../../store/app/selectors";
import PostListItem from "../../components/PostListItem";
import { useFetchOwnFeed } from "../../hooks";

const Posts = () => {
    const { fetch, response, pageInfo, loaded } = useFetchOwnFeed();
    const profile = useSelector(getProfile);
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
        <div>
            {response == null && <div>Loading...</div>}
            {response != null && (
                <List>
                    {response.length === 0 && <div>No posts found</div>}
                    {response.map((post) => (
                        <div key={post.id} style={{ margin: "20px 0" }}>
                            <PostListItem
                                key={post.id}
                                routing={true}
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
                        <Button onClick={() => fetch()}>
                            Load More (Loaded {response.length} out of {pageInfo.total})
                        </Button>
                    )}
                </List>
            )}
        </div>
    );
};

export default wrapLayout(Posts);
