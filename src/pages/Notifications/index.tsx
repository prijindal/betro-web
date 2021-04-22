import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNotifications, NotificationResponse } from "../../api/notifications";
import { wrapLayout } from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";
import { fromNow } from "../../util/fromNow";

const Notifications = () => {
    const auth = useSelector(getAuth);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Array<NotificationResponse> | null>(null);
    const fetchGrps = useCallback(async () => {
        async function fetchgr() {
            if (auth.token !== null) {
                const resp = await fetchNotifications(auth.token);
                setLoaded(true);
                if (resp !== null) {
                    setNotifications(resp);
                }
            }
        }
        fetchgr();
    }, [auth.token]);
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
                            a.action === "on_followed"
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
