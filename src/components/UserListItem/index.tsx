import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { bufferToImageUrl } from "../../util/bufferToImage";

const UserListItem: React.FunctionComponent<{
    user: {
        first_name: string | null;
        last_name: string | null;
        username: string;
        profile_picture: Buffer | null;
    };
}> = (props) => {
    const { user, children } = props;
    const primaryText =
        user.first_name != null ? `${user.first_name} ${user.last_name}` : user.username;
    return (
        <ListItem>
            {user.profile_picture != null && (
                <ListItemAvatar>
                    <Avatar alt={primaryText} src={bufferToImageUrl(user.profile_picture)} />
                </ListItemAvatar>
            )}
            <ListItemText
                primary={primaryText}
                secondary={
                    user.first_name != null ? (
                        <Typography component="span" variant="body2" color="textPrimary">
                            {user.username}
                        </Typography>
                    ) : undefined
                }
            />
            {children}
        </ListItem>
    );
};

export default UserListItem;
