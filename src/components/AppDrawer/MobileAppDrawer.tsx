import React from "react";
import Drawer from "@material-ui/core/Drawer";
import AppDrawer from "../AppDrawer";

const MobileAppDrawer: React.FunctionComponent<{
    includeRouting: boolean;
    open: boolean;
    setOpen: (b: boolean) => void;
}> = (props) => {
    const { includeRouting, open, setOpen } = props;
    return (
        <Drawer
            sx={{ display: { md: "none", xs: "block" } }}
            onClose={() => setOpen(false)}
            variant="temporary"
            open={open}
        >
            <AppDrawer includeRouting={includeRouting} />
        </Drawer>
    );
};

export default MobileAppDrawer;
