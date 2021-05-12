import React, { useCallback, useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { wrapLayout } from "../../components/Layout";
import { getProfile } from "../../store/app/selectors";
import { imageUrlToBuffer } from "../../util/bufferToImage";
import ProfileForm from "./ProfileForm";
import Button from "../../components/Button";

const Profile = () => {
    const profile = useSelector(getProfile);
    const [editing, setEditing] = useState<boolean>(false);
    const [loadedProfilePicture, setLoadedProfilePicture] = useState<Buffer | null>(null);
    const loadLocalProfilePicture = useCallback(async () => {
        if (profile.profile_picture != null) {
            const buf = await imageUrlToBuffer(profile.profile_picture);
            setLoadedProfilePicture(buf);
        }
    }, [profile.profile_picture]);
    useEffect(() => {
        loadLocalProfilePicture();
    }, [loadLocalProfilePicture]);
    if (profile.isLoaded === false) {
        return <div>Loading</div>;
    }
    if (isEmpty(profile.first_name)) {
        return <ProfileForm method="POST" />;
    }
    if (editing) {
        return (
            <ProfileForm
                method="PUT"
                firstName={profile.first_name}
                lastName={profile.last_name}
                profilePicture={loadedProfilePicture}
            />
        );
    } else {
        return (
            <div>
                <div>
                    <Button onClick={() => setEditing(true)}>Edit</Button>
                </div>
                <div>First Name: {profile.first_name}</div>
                <div>Last Name: {profile.last_name}</div>
                <div>
                    {profile.profile_picture != null ? (
                        <img src={profile.profile_picture} alt="Profile" />
                    ) : (
                        <span>No Profile Picture found</span>
                    )}
                </div>
            </div>
        );
    }
};

export default wrapLayout(Profile);
