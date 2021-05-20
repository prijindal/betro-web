import React, { useState, useCallback, useEffect } from "react";
import { useFollowUserHook } from "../../hooks";
import ConfirmDialog from "../../ui/ConfirmDialog";
import Switch from "../../ui/Switch";
import Button from "../../ui/Button";
import BetroApiObject from "../../api/context";
import isEmpty from "lodash/isEmpty";

const FollowButton: React.FunctionComponent<{
    id: string;
    username: string;
    onFollow?: () => void;
}> = (props) => {
    const { id, username, onFollow } = props;
    const [allowProfileRead, setAllowProfileRead] = useState<boolean>(false);
    const [key, setKey] = useState<{ id: string; public_key: string } | null>(null);
    const [confirmFollow, setConfirmFollow] = useState<boolean>(false);
    const followUser = useFollowUserHook(id, key?.id);
    const followHandler = useCallback(() => {
        setConfirmFollow(false);
        followUser(allowProfileRead ? key?.public_key : null).then(onFollow);
    }, [followUser, onFollow, key?.public_key, allowProfileRead]);
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
                description={
                    <div>
                        <Switch
                            value={allowProfileRead}
                            onChange={setAllowProfileRead}
                            label="Allow user to see your name and profile picture"
                        />
                    </div>
                }
            />
        </div>
    );
};

export default FollowButton;
