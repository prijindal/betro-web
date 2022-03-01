import React from "react";
import { Drawer } from "@mantine/core";
import AppDrawer from "../AppDrawer";

const MobileAppDrawer: React.FunctionComponent<{
    includeRouting: boolean;
    open: boolean;
    setOpen: (b: boolean) => void;
}> = (props) => {
    const { includeRouting, open, setOpen } = props;
    return (
        <Drawer onClose={() => setOpen(false)} opened={open} hideCloseButton>
            <AppDrawer includeRouting={includeRouting} />
        </Drawer>
    );
};

export default MobileAppDrawer;
