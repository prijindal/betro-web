import axios from "axios";
import { API_HOST } from "../constants";

export type UserSettingsAction = "notification_on_approved" | "notification_on_followed";

export interface NotificationResponse {
    id: string;
    user_id: string;
    action: UserSettingsAction;
    content: string;
    payload: Record<string, unknown>;
    created_at: string;
}

export const fetchNotifications = async (
    token: string
): Promise<Array<NotificationResponse> | null> => {
    try {
        const response = await axios.get(`${API_HOST}/api/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};
