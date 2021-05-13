import React, { useState } from "react";
import BetroApiObject from "../../api/context";
import Button from "../../components/Button";
import Switch from "../../components/Switch";
import TextField from "../../components/TextField";

const NewGroupForm = (params: { isDefault?: boolean; onCreated: () => void }) => {
    const [name, setName] = useState<string>("");
    const [isDefault, setIsDefault] = useState<boolean>(params.isDefault || false);
    const handleNewGroup = (e: React.FormEvent) => {
        e.preventDefault();
        BetroApiObject.group.createGroup(name, isDefault).then(params.onCreated);
        setIsDefault(false);
        setName("");
    };
    return (
        <form className="flex flex-row items-center px-8" onSubmit={handleNewGroup}>
            <TextField
                placeholder="Followers"
                type="text"
                label="Group name"
                value={name}
                onChange={setName}
            />
            <Switch className="mr-4" value={isDefault} onChange={setIsDefault} label="Default" />
            <Button aria-label="New Group" outlined type="submit">
                New group
            </Button>
        </form>
    );
};

export default NewGroupForm;
