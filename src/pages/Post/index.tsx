import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createTextPost } from "../../api/post";
import { wrapLayout } from "../../components/Layout";
import { getAuth, getGroup } from "../../store/app/selectors";
import { useFetchGroupsHook } from "../../util/customHooks";

const Post = () => {
    const auth = useSelector(getAuth);
    const [groupId, setGroupId] = useState<string>("");
    const groupData = useSelector(getGroup);
    const [text, setText] = useState<string>("");
    const fetchGroups = useFetchGroupsHook();
    useEffect(() => {
        fetchGroups();
        if (groupData.isLoaded) {
            const defaultGroup = groupData.data.find((a) => a.is_default);
            if (defaultGroup != null) {
                setGroupId(defaultGroup.id);
            }
        }
    }, [groupData, fetchGroups]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const group = groupData.data.find((a) => a.id === groupId);
        if (
            auth.token !== null &&
            auth.encryptionKey !== null &&
            auth.encryptionMac !== null &&
            group !== undefined
        ) {
            await createTextPost(
                auth.token,
                groupId,
                group?.sym_key,
                auth.encryptionKey,
                auth.encryptionMac,
                text
            );
        }
    };
    if (groupData.isLoaded === false) {
        return <div>Loading</div>;
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
                <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                    {groupData.data.map((g) => (
                        <option key={g.id} value={g.id}>
                            {g.name}
                        </option>
                    ))}
                </select>
                <button>Post</button>
            </form>
        </div>
    );
};

export default wrapLayout(Post);
