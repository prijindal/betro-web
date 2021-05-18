import React, { useCallback, useEffect, useState } from "react";
import BetroApiObject from "../../api/context";
import { NotificationResponse } from "betro-js-client";
import { wrapLayout } from "../../components/Layout";
import NotificationComponent from "./NotificationComponent";
import { LoadingSpinnerCenter } from "../../components/LoadingSpinner";

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
        return <LoadingSpinnerCenter />;
    }
    if (notifications === null) {
        return <div>Some error</div>;
    }
    return (
        <ul>
            {notifications.length === 0 && <div>No Notifications</div>}
            {notifications.map((a) => (
                <NotificationComponent key={a.id} notification={a} />
            ))}
        </ul>
    );
};

export default wrapLayout(Notifications);
