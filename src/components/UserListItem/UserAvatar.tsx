import React from "react";
import { bufferToImageUrl } from "@betro/client";
import { getPrimaryText } from "./getPrimaryText";
import { UserListItemUserProps } from "./types";

export const UserAvatar: React.FunctionComponent<{
    user: UserListItemUserProps;
}> = (props) => {
    const { user } = props;
    if (user.profile_picture != null) {
        return (
            <div className="flex-shrink-0 h-10 w-10">
                <img
                    className="h-10 w-10 rounded-full"
                    src={
                        typeof user.profile_picture == "string"
                            ? user.profile_picture
                            : bufferToImageUrl(user.profile_picture)
                    }
                    alt={getPrimaryText(user)}
                />
            </div>
        );
    } else {
        return <div />;
    }
};
