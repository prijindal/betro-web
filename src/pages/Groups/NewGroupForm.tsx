import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import { useSelector } from "react-redux";
import { createGroup } from "../../api/group";
import { getAuth } from "../../store/app/selectors";

const NewGroupForm = (params: { isDefault?: boolean; onCreated: () => void }) => {
    const [name, setName] = useState<string>("");
    const [isDefault, setIsDefault] = useState<boolean>(params.isDefault || false);
    const auth = useSelector(getAuth);
    const handleNewGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (auth.token !== null && auth.encryptionKey !== null && auth.encryptionMac !== null) {
            createGroup(auth.token, auth.encryptionKey, auth.encryptionMac, name, isDefault).then(
                params.onCreated
            );
            setIsDefault(false);
            setName("");
        }
    };
    return (
        <form onSubmit={handleNewGroup}>
            <TextField
                label="Group name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <FormControlLabel
                control={
                    <Switch checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                }
                label="Default"
            />
            <Button type="submit">New group</Button>
        </form>
    );
};

export default NewGroupForm;
