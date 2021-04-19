import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AppState, AuthState } from '../../store/app/types';
import { fetchNotifications, NotificationResponse } from '../../api/notifications';

const Page = () => {
    const auth = useSelector<{ app: AppState }, AuthState>((a) => a.app.auth);
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
                            a.action === 'on_followed'
                                ? '/approvals'
                                : `/user/${a.payload.username}`
                        }
                    >
                        <b>{a.content}&nbsp;</b>
                    </Link>
                    <span>{moment(a.created_at).fromNow()}</span>
                </div>
            ))}
        </div>
    );
};

export default Page;
