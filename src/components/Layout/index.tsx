import React, { useCallback, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import classes from "./Layout.module.scss";
import TopAppBar from "../TopAppBar";
import AppDrawer from "../AppDrawer";

const Layout: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { children, includeRouting } = props;
    const [open, setOpen] = useState<boolean>(false);
    const drawerToggle = useCallback(() => setOpen(!open), [open]);
    return (
        <div className={classes.wrapper}>
            <TopAppBar onDrawerToggle={drawerToggle} includeRouting={includeRouting} />
            <div className={classes.appWrapper}>
                <Hidden mdUp implementation="css">
                    <Drawer onClose={() => setOpen(false)} variant="temporary" open={open}>
                        <AppDrawer includeRouting={includeRouting} />
                    </Drawer>
                </Hidden>
                <Hidden mdDown implementation="css">
                    <AppDrawer includeRouting={includeRouting} />
                </Hidden>
                <div className={classes.pageWrapper}>{children}</div>
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
