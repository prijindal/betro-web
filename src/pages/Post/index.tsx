import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchGroups, GroupResponse } from "../../api/account";
import { createTextPost } from "../../api/post";
import Layout from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";

const Post = () => {
    const auth = useSelector(getAuth);
    const [groupId, setGroupId] = useState<string>("");
    const [loaded, setLoaded] = useState<boolean>(false);
    const [groups, setGroups] = useState<Array<GroupResponse> | null>(null);
    const [text, setText] = useState<string>("");
    useEffect(() => {
        async function fetchgr() {
            if (auth.token !== null) {
                const resp = await fetchGroups(auth.token);
                setLoaded(true);
                if (resp !== null) {
                    setGroups(resp);
                    setGroupId(resp[0].id);
                }
            }
        }
        fetchgr();
    }, [auth.token]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const group = groups?.find((a) => a.id === groupId);
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
    if (loaded === false) {
        return <div>Loading</div>;
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
                <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                    {groups?.map((g) => (
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

const Page = () => (
    <Layout>
        <Post />
    </Layout>
);

export default Page;
