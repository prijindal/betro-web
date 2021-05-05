import axios from "axios";
import AuthController from "./auth";
import { NotificationResponse } from "./types";

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

    readNotification = async (notification_id: string): Promise<boolean> => {
        try {
            const response = await axios.post(
                `${this.auth.host}/api/notifications/read`,
                {
                    notification_id,
                },
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            return response.data.read;
        } catch (e) {
            return false;
        }
    };
}

export default NotificationController;
