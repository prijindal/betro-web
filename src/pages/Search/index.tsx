import React, { useCallback, useState } from "react";
import throttle from "lodash/throttle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import BetroApiObject from "../../api/context";
import { wrapLayout } from "../../components/Layout";
import UserListItem from "../../components/UserListItem";
import FollowButton from "../../components/FollowButton";
import { SearchResult } from "../../api";
import Button from "../../components/Button";

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
    return (
        <div>
            <FormControl>
                <InputLabel htmlFor="user-search">Search</InputLabel>
                <Input
                    id="user-search"
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        // searchUserThrottled(e.target.value);
                    }}
                    endAdornment={
                        <InputAdornment position="end">
                            <Button outlined onClick={() => searchUserThrottled(query)}>
                                <SearchIcon />
                            </Button>
                        </InputAdornment>
                    }
                />
            </FormControl>
            {loading && <div>Loading</div>}
            <ul>
                {results.length === 0 && <div>No results found</div>}
                {results.map((a) => (
                    <UserListItem key={a.id} user={a} routing={true}>
                        <div>
                            {a.is_following ? (
                                <Typography component="span" variant="body2" color="textPrimary">
                                    {a.is_following_approved
                                        ? "Already following"
                                        : "Follow not approved"}
                                </Typography>
                            ) : (
                                <FollowButton
                                    username={a.username}
                                    public_key={a.public_key}
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
