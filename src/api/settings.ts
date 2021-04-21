import axios from "axios";
import { API_HOST } from "../constants";

export type NotificationSettingsAction = "on_approved" | "on_followed";

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
        const response = await axios.get(`${API_HOST}/api/settings/notifications`, {
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
            `${API_HOST}/api/settings/notifications`,
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
