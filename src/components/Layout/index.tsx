import React, { useCallback, useState } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Theme } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import TopAppBar from "../TopAppBar";
import AppDrawer from "../AppDrawer";

const Layout: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { children, includeRouting } = props;
    const [open, setOpen] = useState<boolean>(false);
    const hidden = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md"));
    const drawerToggle = useCallback(() => setOpen(!open), [open]);
    return (
        <div className="flex flex-row h-full overflow-hidden">
            {hidden ? (
                <Drawer
                    sx={{ display: { md: "none", xs: "block" } }}
                    onClose={() => setOpen(false)}
                    variant="temporary"
                    open={open}
                >
                    <AppDrawer includeRouting={includeRouting} />
                </Drawer>
            ) : (
                <AppDrawer includeRouting={includeRouting} />
            )}
            <div className="flex-1 overflow-auto ml-auto mr-auto">
                <TopAppBar
                    position="sticky"
                    onDrawerToggle={drawerToggle}
                    includeRouting={includeRouting}
                />
                <div className="m-1">{children}</div>
            </div>
        </div>
    );
};

export const wrapLayout = (
    children: React.FunctionComponent,
    options: { includeRouting: boolean } = { includeRouting: true }
): React.FunctionComponent => {
    return (props) => <Layout includeRouting={options.includeRouting}>{children(props)}</Layout>;
};

export default Layout;
