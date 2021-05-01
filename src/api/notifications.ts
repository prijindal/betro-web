import axios from "axios";
import AuthController from "./auth";

export type UserSettingsAction = "notification_on_approved" | "notification_on_followed";

export interface NotificationResponse {
    id: string;
    user_id: string;
    action: UserSettingsAction;
    content: string;
    payload: Record<string, unknown>;
    created_at: string;
}

class NotificationController {
    auth: AuthController;
    constructor(auth: AuthController) {
        this.auth = auth;
    }

    fetchNotifications = async (): Promise<Array<NotificationResponse> | null> => {
        try {
            const response = await axios.get(`${this.auth.host}/api/notifications`, {
                headers: { Authorization: `Bearer ${this.auth.token}` },
            });
            const data = response.data;
            return data;
        } catch (e) {
            return null;
        }
    };
}

export default NotificationController;
