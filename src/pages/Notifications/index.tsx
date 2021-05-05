import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import BetroApiObject from "../../api/context";
import { NotificationResponse } from "../../api";
import { wrapLayout } from "../../components/Layout";
import NotificationComponent from "./NotificationComponent";

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
        <List>
            {notifications.length === 0 && <div>No Notifications</div>}
            {notifications.map((a) => (
                <NotificationComponent key={a.id} notification={a} />
            ))}
        </List>
    );
};

export default wrapLayout(Notifications);
