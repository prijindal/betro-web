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
}

export default NotificationController;
