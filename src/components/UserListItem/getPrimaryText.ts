import { UserListItemUserProps } from "./types";

export const getPrimaryText = (user: UserListItemUserProps): string => {
    const primaryText =
        user.first_name != null ? `${user.first_name} ${user.last_name}` : user.username;
    return primaryText || "";
};
