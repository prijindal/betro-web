import React, { useCallback, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import TopAppBar from "../TopAppBar";
import AppDrawer from "../AppDrawer";

const Layout: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { children, includeRouting } = props;
    const [open, setOpen] = useState<boolean>(false);
    const drawerToggle = useCallback(() => setOpen(!open), [open]);
    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row overflow-hidden">
                <Hidden mdUp implementation="js">
                    <Drawer onClose={() => setOpen(false)} variant="temporary" open={open}>
                        <AppDrawer includeRouting={includeRouting} />
                    </Drawer>
                </Hidden>
                <Hidden mdDown implementation="js">
                    <AppDrawer includeRouting={includeRouting} />
                </Hidden>
                <div className="flex-1 overflow-auto ml-auto mr-auto">
                    <TopAppBar
                        position="sticky"
                        onDrawerToggle={drawerToggle}
                        includeRouting={includeRouting}
                    />
                    <div className="m-1">{children}</div>
                </div>
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
