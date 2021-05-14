import React, { useState, useCallback, useEffect } from "react";
import { useFollowUserHook } from "../../hooks";
import ConfirmDialog from "../../components/ConfirmDialog";
import Button from "../../components/Button";
import BetroApiObject from "../../api/context";
import isEmpty from "lodash/isEmpty";

const FollowButton: React.FunctionComponent<{
    id: string;
    username: string;
    onFollow?: () => void;
}> = (props) => {
    const { id, username, onFollow } = props;
    const [key, setKey] = useState<{ id: string; public_key: string } | null>(null);
    const [confirmFollow, setConfirmFollow] = useState<boolean>(false);
    const followUser = useFollowUserHook(id, key?.id, key?.public_key);
    const followHandler = useCallback(() => {
        setConfirmFollow(false);
        followUser().then(onFollow);
    }, [followUser, onFollow]);
    useEffect(() => {
        if (!isEmpty(id) && confirmFollow && key == null) {
            BetroApiObject.follow.fetchUserEcdhKey(id).then((response) => {
                setKey(response);
            });
        }
    }, [id, confirmFollow, key]);
    return (
        <div>
            <Button aria-label="Follow" onClick={() => setConfirmFollow(true)}>
                Follow
            </Button>
            <ConfirmDialog
                id={`user-follow-${id}`}
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
