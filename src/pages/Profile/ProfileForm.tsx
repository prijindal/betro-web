import React, { useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { fetchKeys } from "../../api/login";
import { createProfile, updateProfile } from "../../api/profile";
import { profilePictureLoaded, verifedLogin } from "../../store/app/actions";
import { getAuth } from "../../store/app/selectors";
import { bufferToImageUrl } from "../../util/bufferToImage";
import { useFetchWhoami } from "../../hooks";

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
    const fetchWhoami = useFetchWhoami();
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
                            dispatch(verifedLogin(resp.private_key, sym_key));
                        }
                    });
                }
                fetchWhoami(true, sym_key);
                if (profilePicture != null) {
                    dispatch(profilePictureLoaded(bufferToImageUrl(profilePicture)));
                }
            }
        },
        [dispatch, profilePicture, auth.token, auth.encryptionKey, auth.encryptionMac, fetchWhoami]
    );
    const profileSaveHandler = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (
                auth.token !== null &&
                auth.encryptionKey !== null &&
                auth.symKey != null &&
                auth.encryptionMac !== null
            ) {
                if (props.method === "POST") {
                    createProfile(
                        auth.token,
                        auth.symKey,
                        auth.encryptionKey,
                        auth.encryptionMac,
                        firstName,
                        lastName,
                        profilePicture
                    ).then(() => {
                        if (auth.symKey != null) {
                            afterProfileSaved(auth.symKey);
                        }
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
