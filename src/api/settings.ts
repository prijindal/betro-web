import axios from "axios";
import { API_HOST } from "../constants";

export type UserSettingsAction = "notification_on_approved" | "notification_on_followed";

export interface UserSettingResponse {
    id: string;
    user_id: string;
    action: UserSettingsAction;
    enabled: boolean;
}

export const fetchUserSettings = async (
    token: string
): Promise<Array<UserSettingResponse> | null> => {
    try {
        const response = await axios.get(`${API_HOST}/api/settings`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};

export const changeUserSettings = async (
    token: string,
    action: UserSettingsAction,
    enabled: boolean
): Promise<null> => {
    try {
        const response = await axios.post(
            `${API_HOST}/api/settings`,
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
