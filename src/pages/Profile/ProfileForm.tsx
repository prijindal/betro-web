import React, { useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useDispatch } from "react-redux";
import { profilePictureLoaded, verifedLogin } from "../../store/app/actions";
import { bufferToImageUrl } from "../../util/bufferToImage";
import { useFetchWhoami } from "../../hooks";
import BetroApiObject from "../../api/context";

const ProfileForm: React.FunctionComponent<{
    method: "POST" | "PUT";
    firstName?: string | null;
    lastName?: string | null;
    profilePicture?: Buffer | null;
}> = (props) => {
    const [firstName, setFirstName] = useState<string>(props.firstName || "");
    const [lastName, setLastName] = useState<string>(props.lastName || "");
    const [profilePicture, setProfilePicture] = useState<Buffer | null>(
        props.profilePicture || null
    );
    const dispatch = useDispatch();
    const fetchWhoami = useFetchWhoami();
    const handleUploadClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files != null) {
            const file = event.target.files[0];
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
    const afterProfileSaved = useCallback(() => {
        BetroApiObject.account.fetchKeys().then((resp) => {
            if (resp != null) {
                dispatch(verifedLogin());
            }
        });
        fetchWhoami(true);
        if (profilePicture != null) {
            dispatch(profilePictureLoaded(bufferToImageUrl(profilePicture)));
        }
    }, [dispatch, profilePicture, fetchWhoami]);
    const profileSaveHandler = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (props.method === "POST") {
                BetroApiObject.account
                    .createProfile(firstName, lastName, profilePicture)
                    .then(() => {
                        afterProfileSaved();
                    });
            } else if (props.method === "PUT") {
                BetroApiObject.account
                    .updateProfile(firstName, lastName, profilePicture)
                    .then(() => {
                        afterProfileSaved();
                    });
            } else {
                console.error("Issue occurred");
            }
        },
        [firstName, lastName, profilePicture, afterProfileSaved, props.method]
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
