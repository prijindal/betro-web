import React, { useState, useCallback } from "react";
import { useFollowUserHook } from "../../hooks";
import ConfirmDialog from "../../components/ConfirmDialog";
import Button from "../../components/Button";

const FollowButton: React.FunctionComponent<{
    username: string;
    public_key: string | null;
    onFollow?: () => void;
}> = (props) => {
    const { username, public_key, onFollow } = props;
    const [confirmFollow, setConfirmFollow] = useState<boolean>(false);
    const followUser = useFollowUserHook(username, public_key);
    const followHandler = useCallback(() => {
        setConfirmFollow(false);
        followUser().then(onFollow);
    }, [followUser, onFollow]);
    return (
        <div>
            <Button onClick={() => setConfirmFollow(true)}>Follow</Button>
            <ConfirmDialog
                id={`user-follow-${username}`}
                open={confirmFollow}
                handleCancel={() => setConfirmFollow(false)}
                handleConfirm={followHandler}
                title={`Follow user ${username}?`}
                description="By following this user, you agree to allow them to see your email and name"
            />
        </div>
    );
};

export default FollowButton;
