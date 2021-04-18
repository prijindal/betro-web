import axios from 'axios';

export type NotificationSettingsAction = 'on_approved' | 'on_followed';

export interface UserNotificationSettingResponse {
    id: string;
    user_id: string;
    action: NotificationSettingsAction;
    enabled: boolean;
}

export const fetchNotificationSettings = async (
    token: string
): Promise<Array<UserNotificationSettingResponse> | null> => {
    try {
        const response = await axios.get('http://localhost:4000/api/settings/notifications', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};

export const changeNotificationSettings = async (
    token: string,
    action: NotificationSettingsAction,
    enabled: boolean
): Promise<null> => {
    try {
        const response = await axios.post(
            'http://localhost:4000/api/settings/notifications',
            { action, enabled },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};
