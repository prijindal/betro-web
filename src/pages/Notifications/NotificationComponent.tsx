import React from "react";
import { Link } from "react-router-dom";
import { NotificationResponse } from "../../api";
import { fromNow } from "../../util/fromNow";
import { useReadNotification } from "../../hooks";

const NotificationComponent: React.FunctionComponent<{ notification: NotificationResponse }> = (
    props
) => {
    const { notification } = props;
    const { read, readNotification } = useReadNotification(notification);
    return (
        <li
            className={`relative flex flex-row items-center py-4 px-8 ${read ? "opacity-50" : ""}`}
            onClick={read ? () => null : () => readNotification()}
        >
            <div className="relative flex flex-col items-start">
                <Link
                    to={
                        notification.action === "notification_on_followed"
                            ? "/approvals"
                            : `/user/${notification.payload.username}`
                    }
                >
                    <b>{notification.content}&nbsp;</b>
                </Link>
                <div className="flex flex-row flex-1 justify-end">
                    {fromNow(new Date(Date.parse(notification.created_at)))}
                </div>
            </div>
        </li>
    );
};

export default NotificationComponent;
