import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormControlLabel, List, ListItem, Switch } from "@material-ui/core";
import {
    UserNotificationSettingResponse,
    NotificationSettingsAction,
    changeNotificationSettings,
} from "../../api/settings";
import { wrapLayout } from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";
import { useFetchNotificationSettings, useFetchCountHook } from "../../util/customHooks";

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
    const fetchCount = useFetchCountHook();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        if (auth.token !== null) {
            setEnabled(value);
            setSaving(true);
            changeNotificationSettings(auth.token, notificationSetting.action, value)
                .then(() => {
                    fetchCount(true);
                })
                .finally(() => {
                    setSaving(false);
                });
        }
    };
    return (
        <ListItem>
            <FormControlLabel
                control={<Switch disabled={saving} checked={enabled} onChange={handleChange} />}
                label={notificationSetting.text}
            />
        </ListItem>
    );
};

const NotificationSettings = () => {
    const {
        fetchNotificationSettings,
        loaded,
        notificationSettings,
    } = useFetchNotificationSettings();
    useEffect(() => {
        fetchNotificationSettings();
    }, [fetchNotificationSettings]);
    if (loaded === false) {
        return <div>Loading</div>;
    }
    if (notificationSettings === null) {
        return <div>Some error</div>;
    }
    return (
        <List>
            {parseNotificationSettings(notificationSettings).map((a) => (
                <NotificationSetting key={a.action} notificationSetting={a} />
            ))}
        </List>
    );
};

export default wrapLayout(NotificationSettings);
