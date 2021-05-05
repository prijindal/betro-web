import React from "react";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { NotificationResponse } from "../../api";
import { fromNow } from "../../util/fromNow";
import { useReadNotification } from "../../hooks";

const NotificationComponent: React.FunctionComponent<{ notification: NotificationResponse }> = (
    props
) => {
    const { notification } = props;
    const { read, readNotification } = useReadNotification(notification);
    return (
        <ListItem disabled={read} onClick={read ? () => null : () => readNotification()}>
            <ListItemText
                primary={
                    <Link
                        to={
                            notification.action === "notification_on_followed"
                                ? "/approvals"
                                : `/user/${notification.payload.username}`
                        }
                    >
                        <b>{notification.content}&nbsp;</b>
                    </Link>
                }
                secondary={fromNow(new Date(Date.parse(notification.created_at)))}
            />
        </ListItem>
    );
};

export default NotificationComponent;
