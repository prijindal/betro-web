import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Switch from "@material-ui/core/Switch";
import { UserSettingResponse, UserSettingsAction, changeUserSettings } from "../../api/settings";
import { wrapLayout } from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";
import { useFetchUserSettings, useFetchCountHook } from "../../util/customHooks";

interface SettingNotification {
    action: UserSettingsAction;
    text: string;
    enabled: boolean;
}

const SETTINGS_NOTIFICATIONS: Array<{
    action: UserSettingsAction;
    text: string;
}> = [
    {
        action: "notification_on_approved",
        text: "When somebody approves your follow request",
    },
    {
        action: "notification_on_followed",
        text: "When somebody sends you a follow request",
    },
];

const parseUserSettings = (settings: Array<UserSettingResponse>): Array<SettingNotification> => {
    return SETTINGS_NOTIFICATIONS.map((a) => {
        const userSetting = settings.find((b) => b.action === a.action);
        let enabled = false;
        if (userSetting !== null && userSetting !== undefined) {
            enabled = userSetting.enabled;
        }
        return { ...a, enabled: enabled };
    });
};

const UserSetting = (params: { userSetting: SettingNotification }) => {
    const auth = useSelector(getAuth);
    const userSetting = params.userSetting;
    const [enabled, setEnabled] = useState<boolean>(userSetting.enabled);
    const [saving, setSaving] = useState<boolean>(false);
    const fetchCount = useFetchCountHook();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
        if (auth.token !== null) {
            setEnabled(value);
            setSaving(true);
            changeUserSettings(auth.token, userSetting.action, value)
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
                label={userSetting.text}
            />
        </ListItem>
    );
};

const UserSettings = () => {
    const { fetchUserSettings, loaded, settings } = useFetchUserSettings();
    useEffect(() => {
        fetchUserSettings();
    }, [fetchUserSettings]);
    if (loaded === false) {
        return <div>Loading</div>;
    }
    if (settings === null) {
        return <div>Some error</div>;
    }
    return (
        <List>
            {parseUserSettings(settings).map((a) => (
                <UserSetting key={a.action} userSetting={a} />
            ))}
        </List>
    );
};

export default wrapLayout(UserSettings);
