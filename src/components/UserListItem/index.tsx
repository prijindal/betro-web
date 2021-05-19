import React from "react";
import { Link } from "react-router-dom";
import { UserListItemUserProps as props } from "./types";
import { getPrimaryText } from "./getPrimaryText";
import { UserAvatar } from "./UserAvatar";

export type UserListItemUserProps = props;

export const UserListItemHeader: React.FunctionComponent<{
    user: UserListItemUserProps;
}> = (props) => {
    const { user } = props;

    const secondary = user.first_name != null ? `@${user.username}` : undefined;
    return (
        <div className="flex flex-col justify-center ml-4">
            <div className="font-medium text-gray-900 text-sm">{getPrimaryText(user)}</div>
            <div className="font-normal text-gray-500 text-sm">{secondary}</div>
        </div>
    );
};

const UserListItem: React.FunctionComponent<{
    user: UserListItemUserProps;
    routing?: boolean;
}> = (props) => {
    const { user, routing, children } = props;
    const itemText = <UserListItemHeader user={user} />;
    return (
        <li className="relative flex flex-row items-center py-4 px-8">
            {user.profile_picture != null && (
                <div className="mr-4">
                    <UserAvatar user={user} />
                </div>
            )}
            {routing ? (
                <Link to={{ pathname: `/user/${user.username}` }}>{itemText}</Link>
            ) : (
                itemText
            )}
            <div className="flex flex-row flex-1 justify-end">{children}</div>
        </li>
    );
};

export default UserListItem;
