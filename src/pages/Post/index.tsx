import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import { createPost } from "../../api/post";
import { wrapLayout } from "../../components/Layout";
import { getAuth, getGroup } from "../../store/app/selectors";
import { useFetchGroupsHook } from "../../hooks";
import { bufferToImageUrl } from "../../util/bufferToImage";

const Post = () => {
    const auth = useSelector(getAuth);
    const [groupId, setGroupId] = useState<string>("");
    const groupData = useSelector(getGroup);
    const [text, setText] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [media, setMedia] = useState<Buffer | null>(null);
    const fetchGroups = useFetchGroupsHook();
    useEffect(() => {
        if (groupData.isLoaded) {
            const defaultGroup = groupData.data.find((a) => a.is_default);
            if (defaultGroup != null) {
                setGroupId(defaultGroup.id);
            }
        }
    }, [groupData]);
    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const group = groupData.data.find((a) => a.id === groupId);
        if (
            auth.token !== null &&
            auth.encryptionKey !== null &&
            auth.encryptionMac !== null &&
            group !== undefined
        ) {
            setLoading(true);
            await createPost(
                auth.token,
                groupId,
                group?.sym_key,
                auth.encryptionKey,
                auth.encryptionMac,
                text,
                null,
                media
            );
            setText(null);
            setMedia(null);
            setLoading(false);
        }
    };
    const handleUploadClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files != null) {
            var file = event.target.files[0];
            if (file != null) {
                const reader = new FileReader();
                reader.onloadend = function (e) {
                    const arrayBuffer = reader.result;
                    if (arrayBuffer != null && typeof arrayBuffer != "string") {
                        const buffer = Buffer.from(arrayBuffer);
                        setMedia(buffer);
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        }
    };
    if (groupData.isLoaded === false) {
        return <div>Loading</div>;
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField
                        disabled={loading}
                        type="text"
                        value={text || ""}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Select
                        disabled={loading}
                        value={groupId}
                        onChange={(e) => setGroupId(e.target.value as string)}
                    >
                        {groupData.data.map((g) => (
                            <MenuItem key={g.id} value={g.id}>
                                {g.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <div>
                        {media != null && <img src={bufferToImageUrl(media)} alt="Profile" />}
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
                            <Typography>Upload Media</Typography>
                        </label>
                    </div>
                    <Button type="submit" disabled={loading}>
                        Post
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default wrapLayout(Post);
