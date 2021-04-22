import React from "react";
import classes from "./Layout.module.scss";
import TopAppBar from "../TopAppBar";
import AppDrawer from "../AppDrawer";

const Layout: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { children, includeRouting } = props;
    return (
        <div className={classes.wrapper}>
            <TopAppBar includeRouting={includeRouting} />
            <div className={classes.appWrapper}>
                <AppDrawer includeRouting={includeRouting} />
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
