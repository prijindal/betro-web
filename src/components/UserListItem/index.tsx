import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import { UserListItemUserProps as props } from "./types";
import { getPrimaryText } from "./getPrimaryText";
import { UserAvatar } from "./UserAvatar";

export type UserListItemUserProps = props;

export const UserListItemHeader: React.FunctionComponent<{
    user: UserListItemUserProps;
}> = (props) => {
    const { user } = props;
    return (
        <ListItemText
            primary={getPrimaryText(user)}
            secondary={
                user.first_name != null ? (
                    <Typography component="span" variant="body2" color="textPrimary">
                        {user.username}
                    </Typography>
                ) : undefined
            }
        />
    );
};

const UserListItem: React.FunctionComponent<{
    user: UserListItemUserProps;
    routing?: boolean;
}> = (props) => {
    const { user, routing, children } = props;
    const itemText = <UserListItemHeader user={user} />;
    return (
        <ListItem>
            {user.profile_picture != null && (
                <ListItemAvatar>
                    <UserAvatar user={user} />
                </ListItemAvatar>
            )}
            {routing ? (
                <Link to={{ pathname: `/user/${user.username}`, state: user }}>{itemText}</Link>
            ) : (
                itemText
            )}
            {children}
        </ListItem>
    );
};

export default UserListItem;
