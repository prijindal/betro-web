import axios from 'axios';

export type NotificationSettingsAction = 'on_approved' | 'on_followed';

export interface NotificationResponse {
    id: string;
    user_id: string;
    action: NotificationSettingsAction;
    content: string;
    payload: Record<string, unknown>;
    created_at: Date;
}

export const fetchNotifications = async (
    token: string
): Promise<Array<NotificationResponse> | null> => {
    try {
        const response = await axios.get('http://localhost:4000/api/notifications', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        return data;
    } catch (e) {
        return null;
    }
};
