import { Button, TextField, Typography } from "@material-ui/core";
import { generateSymKey } from "betro-js-lib";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserProfileResponse, fetchProfile, createProfile, updateProfile } from "../../api/profile";
import { wrapLayout } from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";
import { bufferToImageUrl } from "../../util/bufferToImage";

const Profile = () => {
    const auth = useSelector(getAuth);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<Buffer | null>(null);
    const fetchProfl = useCallback(async () => {
        async function fetchgr() {
            if (auth.token !== null && auth.encryptionKey !== null && auth.encryptionMac !== null) {
                const resp = await fetchProfile(auth.token, auth.encryptionKey, auth.encryptionMac);
                setLoaded(true);
                if (resp !== null) {
                    setProfile(resp);
                }
            }
        }
        fetchgr();
    }, [auth.token, auth.encryptionKey, auth.encryptionMac]);
    useEffect(() => {
        fetchProfl();
    }, [fetchProfl]);
    const handleUploadClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log();
        if (event.target.files != null) {
            var file = event.target.files[0];
            if (file != null) {
                const reader = new FileReader();
                reader.onloadend = function (e) {
                    const arrayBuffer = reader.result;
                    if (arrayBuffer != null && typeof arrayBuffer != "string") {
                        const buffer = Buffer.from(arrayBuffer);
                        setProfilePicture(buffer);
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        }
    };
    const profileSaveHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const sym_key = await generateSymKey();
        if (
            auth.token !== null &&
            auth.encryptionKey !== null &&
            auth.encryptionMac !== null &&
            profilePicture != null
        ) {
            createProfile(
                auth.token,
                sym_key,
                auth.encryptionKey,
                auth.encryptionMac,
                firstName,
                lastName,
                profilePicture
            ).then(fetchProfl);
        }
    };
    if (loaded === false) {
        return <div>Loading</div>;
    }
    if (profile === null) {
        return (
            <div>
                <div>Profile not present</div>
                <form onSubmit={profileSaveHandler}>
                    <div>
                        <TextField
                            type="text"
                            value={firstName}
                            label="First Name"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <TextField
                            type="text"
                            value={lastName}
                            label="Last Name"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div>
                        {profilePicture != null && <img src={bufferToImageUrl(profilePicture)} />}
                    </div>
                    <div>
                        <input
                            style={{ display: "none" }}
                            accept="image/*"
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={handleUploadClick}
                        />
                        <label htmlFor="contained-button-file">
                            <Typography>Upload profile picture</Typography>
                        </label>
                    </div>
                    <div>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        );
    }
    return (
        <div>
            <div>First Name: {profile.first_name}</div>
            <div>Last Name: {profile.last_name}</div>
            <div>
                <img src={bufferToImageUrl(profile.profile_picture)} />
            </div>
        </div>
    );
};

export default wrapLayout(Profile);
