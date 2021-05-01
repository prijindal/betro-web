import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BetroApiObject from "../../api/context";
import { NotificationResponse } from "../../api/notifications";
import { wrapLayout } from "../../components/Layout";
import { fromNow } from "../../util/fromNow";

const Notifications = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Array<NotificationResponse> | null>(null);
    const fetchGrps = useCallback(async () => {
        async function fetchgr() {
            const resp = await BetroApiObject.notifications.fetchNotifications();
            setLoaded(true);
            if (resp !== null) {
                setNotifications(resp);
            }
        }
        fetchgr();
    }, []);
    useEffect(() => {
        fetchGrps();
    }, [fetchGrps]);
    if (loaded === false) {
        return <div>Loading</div>;
    }
    if (notifications === null) {
        return <div>Some error</div>;
    }
    return (
        <div>
            {notifications.length === 0 && <div>No Notifications</div>}
            {notifications.map((a) => (
                <div key={a.id}>
                    <Link
                        to={
                            a.action === "notification_on_followed"
                                ? "/approvals"
                                : `/user/${a.payload.username}`
                        }
                    >
                        <b>{a.content}&nbsp;</b>
                    </Link>
                    <span>{fromNow(new Date(Date.parse(a.created_at)))}</span>
                </div>
            ))}
        </div>
    );
};

export default wrapLayout(Notifications);
