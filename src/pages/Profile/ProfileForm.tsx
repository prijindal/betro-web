import React, { useCallback, useState } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import { generateSymKey } from "betro-js-lib";
import { useDispatch, useSelector } from "react-redux";
import { fetchKeys, whoAmi } from "../../api/login";
import { createProfile, updateProfile } from "../../api/profile";
import { profileLoaded, profilePictureLoaded, verifedLogin } from "../../store/app/actions";
import { getAuth } from "../../store/app/selectors";
import { bufferToImageUrl } from "../../util/bufferToImage";

const ProfileForm: React.FunctionComponent<{
    method: "POST" | "PUT";
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: Buffer | null;
}> = (props) => {
    const auth = useSelector(getAuth);
    const [firstName, setFirstName] = useState<string>(props.firstName || "");
    const [lastName, setLastName] = useState<string>(props.lastName || "");
    const [profilePicture, setProfilePicture] = useState<Buffer | null>(
        props.profilePicture || null
    );
    const dispatch = useDispatch();
    const handleUploadClick = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const afterProfileSaved = useCallback(
        (sym_key: string) => {
            if (auth.token != null) {
                if (auth.encryptionKey !== null && auth.encryptionMac !== null) {
                    fetchKeys(auth.token, auth.encryptionKey, auth.encryptionMac).then((resp) => {
                        if (resp != null) {
                            dispatch(verifedLogin(resp.private_key, resp.sym_key));
                        }
                    });
                }
                whoAmi(auth.token, sym_key).then((resp) => {
                    if (resp !== null) {
                        dispatch(
                            profileLoaded(
                                resp.user_id,
                                resp.username,
                                resp.email,
                                resp.first_name,
                                resp.last_name
                            )
                        );
                    }
                });
                if (profilePicture != null) {
                    dispatch(profilePictureLoaded(bufferToImageUrl(profilePicture)));
                }
            }
        },
        [dispatch, profilePicture, auth.token, auth.encryptionKey, auth.encryptionMac]
    );
    const profileSaveHandler = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (
                auth.token !== null &&
                auth.encryptionKey !== null &&
                auth.encryptionMac !== null &&
                profilePicture != null
            ) {
                if (props.method === "POST") {
                    const sym_key = await generateSymKey();
                    createProfile(
                        auth.token,
                        sym_key,
                        auth.encryptionKey,
                        auth.encryptionMac,
                        firstName,
                        lastName,
                        profilePicture
                    ).then(() => {
                        afterProfileSaved(sym_key);
                    });
                } else if (props.method === "PUT" && auth.symKey != null) {
                    updateProfile(
                        auth.token,
                        auth.symKey,
                        firstName,
                        lastName,
                        profilePicture
                    ).then(() => {
                        if (auth.symKey != null) {
                            afterProfileSaved(auth.symKey);
                        }
                    });
                } else {
                    console.error("Issue occurred");
                }
            }
        },
        [
            auth.encryptionKey,
            auth.encryptionMac,
            auth.symKey,
            auth.token,
            firstName,
            lastName,
            profilePicture,
            afterProfileSaved,
            props.method,
        ]
    );

    return (
        <div>
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
                    {profilePicture != null && (
                        <img src={bufferToImageUrl(profilePicture)} alt="Profile" />
                    )}
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
};

export default ProfileForm;
