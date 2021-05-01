import axios from "axios";
import AuthController from "./auth";

export type UserSettingsAction = "notification_on_approved" | "notification_on_followed";

export interface UserSettingResponse {
    id: string;
    user_id: string;
    action: UserSettingsAction;
    enabled: boolean;
}

class SettingsController {
    auth: AuthController;
    constructor(auth: AuthController) {
        this.auth = auth;
    }
    fetchUserSettings = async (): Promise<Array<UserSettingResponse> | null> => {
        try {
            const response = await axios.get(`${this.auth.host}/api/settings`, {
                headers: { Authorization: `Bearer ${this.auth.token}` },
            });
            const data = response.data;
            return data;
        } catch (e) {
            return null;
        }
    };

    changeUserSettings = async (action: UserSettingsAction, enabled: boolean): Promise<null> => {
        try {
            const response = await axios.post(
                `${this.auth.host}/api/settings`,
                { action, enabled },
                {
                    headers: { Authorization: `Bearer ${this.auth.token}` },
                }
            );
            const data = response.data;
            return data;
        } catch (e) {
            return null;
        }
    };
}

export default SettingsController;
