import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    fetchNotificationSettings,
    UserNotificationSettingResponse,
    NotificationSettingsAction,
    changeNotificationSettings,
} from "../../api/settings";
import { wrapLayout } from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";

interface SettingNotification {
    action: NotificationSettingsAction;
    text: string;
    enabled: boolean;
}

const SETTINGS_NOTIFICATIONS: Array<{
    action: NotificationSettingsAction;
    text: string;
}> = [
    {
        action: "on_approved",
        text: "When somebody approves your follow request",
    },
    {
        action: "on_followed",
        text: "When somebody sends you a follow request",
    },
];

const parseNotificationSettings = (
    notificationSettings: Array<UserNotificationSettingResponse>
): Array<SettingNotification> => {
    return SETTINGS_NOTIFICATIONS.map((a) => {
        const notificationSetting = notificationSettings.find((b) => b.action === a.action);
        let enabled = false;
        if (notificationSetting !== null && notificationSetting !== undefined) {
            enabled = notificationSetting.enabled;
        }
        return { ...a, enabled: enabled };
    });
};

const NotificationSetting = (params: { notificationSetting: SettingNotification }) => {
    const auth = useSelector(getAuth);
    const notificationSetting = params.notificationSetting;
    const [enabled, setEnabled] = useState<boolean>(notificationSetting.enabled);
    const [saving, setSaving] = useState<boolean>(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        if (auth.token !== null) {
            setEnabled(value);
            setSaving(true);
            changeNotificationSettings(auth.token, notificationSetting.action, value)
                .then(() => {})
                .finally(() => {
                    setSaving(false);
                });
        }
    };
    return (
        <div>
            <span>{notificationSetting.text}</span>
            <input disabled={saving} type="checkbox" checked={enabled} onChange={handleChange} />
        </div>
    );
};

const NotificationSettings = () => {
    const auth = useSelector(getAuth);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [
        notificationSettings,
        setNotificationSettings,
    ] = useState<Array<UserNotificationSettingResponse> | null>(null);
    const fetchGrps = useCallback(async () => {
        async function fetchgr() {
            if (auth.token !== null) {
                const resp = await fetchNotificationSettings(auth.token);
                setLoaded(true);
                if (resp !== null) {
                    setNotificationSettings(resp);
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
    if (notificationSettings === null) {
        return <div>Some error</div>;
    }
    return (
        <div>
            {parseNotificationSettings(notificationSettings).map((a) => (
                <NotificationSetting key={a.action} notificationSetting={a} />
            ))}
        </div>
    );
};

export default wrapLayout(NotificationSettings);
