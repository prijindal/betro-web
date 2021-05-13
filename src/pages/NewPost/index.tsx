import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { wrapLayout } from "../../components/Layout";
import GroupSelect from "../../components/GroupSelect";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import { useFetchGroupsHook, useGroupSelector } from "../../hooks";
import { bufferToImageUrl } from "../../util/bufferToImage";
import BetroApiObject from "../../api/context";
import { incrementCount } from "../../store/app/actions";
import { LoadingSpinnerCenter } from "../../components/LoadingSpinner";

const NewPost = () => {
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
            await BetroApiObject.post.createPost(groupId, group?.sym_key, text, null, media);
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
        return <LoadingSpinnerCenter />;
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col max-w-sm">
                    <TextField
                        className="mb-4"
                        disabled={loading}
                        type="text"
                        placeholder="Post Title"
                        value={text || ""}
                        onChange={setText}
                    />
                    <GroupSelect
                        className="mb-4"
                        disabled={loading}
                        groupId={groupId}
                        setGroupId={setGroupId}
                        groupData={groupData}
                    />
                    <div>
                        {media != null && <img src={bufferToImageUrl(media)} alt="Profile" />}
                    </div>
                    <div className="flex flex-row items-center mb-4">
                        <input
                            className="hidden"
                            accept="image/*"
                            id="contained-button-file"
                            multiple
                            type="file"
                            onChange={handleUploadClick}
                        />
                        <label htmlFor="contained-button-file">
                            <span className="text-base text-gray-700">Upload Media</span>
                        </label>
                    </div>
                    <Button aria-label="Post" type="submit" disabled={loading}>
                        Post
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default wrapLayout(NewPost);
