import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import { wrapLayout } from "../../components/Layout";
import { useFetchGroupsHook, useGroupSelector } from "../../hooks";
import { bufferToImageUrl } from "../../util/bufferToImage";
import BetroApiObject from "../../api/context";
import { incrementCount } from "../../store/app/actions";

const Post = () => {
    const { groupId, setGroupId, groupData } = useGroupSelector();
    const [text, setText] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [media, setMedia] = useState<Buffer | null>(null);
    const dispatch = useDispatch();
    const fetchGroups = useFetchGroupsHook();
    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const group = groupData.data.find((a) => a.id === groupId);
        if (group !== undefined) {
            setLoading(true);
            await BetroApiObject.account.createPost(groupId, group?.sym_key, text, null, media);
            setText(null);
            setMedia(null);
            setLoading(false);
            dispatch(incrementCount("posts"));
        }
    };
    const handleUploadClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files != null) {
            const file = event.target.files[0];
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
