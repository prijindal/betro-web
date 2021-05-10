import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import { bufferToImageUrl } from "../../util/bufferToImage";

export interface UserListItemUserProps {
    username: string | null;
    first_name?: string | null;
    last_name?: string | null;
    profile_picture?: Buffer | string | null;
}

export const getPrimaryText = (user: UserListItemUserProps): string => {
    const primaryText =
        user.first_name != null ? `${user.first_name} ${user.last_name}` : user.username;
    return primaryText || "";
};

export const UserAvatar: React.FunctionComponent<{
    user: UserListItemUserProps;
}> = (props) => {
    const { user } = props;
    if (user.profile_picture != null) {
        return (
            <div className="flex-shrink-0 h-10 w-10">
                <img
                    className="h-10 w-10 rounded-full"
                    src={
                        typeof user.profile_picture == "string"
                            ? user.profile_picture
                            : bufferToImageUrl(user.profile_picture)
                    }
                    alt={getPrimaryText(user)}
                />
            </div>
        );
    } else {
        return <div />;
    }
};

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
