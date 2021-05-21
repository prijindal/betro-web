import React, { useCallback, useState } from "react";
import throttle from "lodash/throttle";
import SearchIcon from "@heroicons/react/solid/SearchIcon";
import BetroApiObject from "../../api/context";
import { wrapLayout } from "../../components/Layout";
import UserListItem from "../../components/UserListItem";
import FollowButton from "../../components/FollowButton";
import { SearchResult } from "betro-js-client";
import Button from "../../ui/Button";
import TextField from "../../ui/TextField";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";

const Search = () => {
    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<Array<SearchResult>>([]);
    const searchUser = useCallback(async (query: string) => {
        if (query.length > 0) {
            setLoading(true);
            const searchResults = await BetroApiObject.follow.searchUser(query);
            setResults(searchResults);
            setLoading(false);
        } else {
            setResults([]);
        }
    }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const searchUserThrottled = useCallback(throttle(searchUser, 2000), []);
    const searchForm = (e: React.FormEvent) => {
        e.preventDefault();
        searchUserThrottled(query);
    };
    return (
        <div>
            <form onClick={searchForm} className="flex flex-row items-center">
                <TextField
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => {
                        setQuery(e);
                        // searchUserThrottled(e);
                    }}
                />
                <div className="ml-2 text-center flex text-gray-500">
                    <Button aria-label="Search" type="submit">
                        <SearchIcon className="heroicon" />
                    </Button>
                </div>
            </form>
            {loading && <LoadingSpinnerCenter />}
            <ul>
                {results.length === 0 && <div>No results found</div>}
                {results.map((a) => (
                    <UserListItem key={a.id} user={a} routing={true}>
                        <div>
                            {a.is_following ? (
                                <span className="text-sm text-black">
                                    {a.is_following_approved
                                        ? "Already following"
                                        : "Follow not approved"}
                                </span>
                            ) : (
                                <FollowButton
                                    id={a.id}
                                    username={a.username}
                                    onFollow={() => searchUserThrottled(query)}
                                />
                            )}
                        </div>
                    </UserListItem>
                ))}
            </ul>
        </div>
    );
};

export default wrapLayout(Search);
