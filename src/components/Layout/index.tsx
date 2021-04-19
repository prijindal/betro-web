import AppBar from "@material-ui/core/AppBar";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import React from "react";
import classes from "./Layout.module.scss";
import NavLink from "../NavLink";
import { Link } from "react-router-dom";

const Layout: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { children, includeRouting } = props;
    return (
        <div className={classes.wrapper}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        component={includeRouting ? Link : "a"}
                        to="/home"
                        href="/home"
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                    >
                        <HomeIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Betro
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.appWrapper}>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    <List>
                        <NavLink includeRouting={includeRouting} to="/home">
                            Home
                        </NavLink>
                        <NavLink includeRouting={includeRouting} to="/notifications">
                            Notifications
                        </NavLink>
                        <NavLink includeRouting={includeRouting} to="/approvals">
                            Approvals
                        </NavLink>
                        <NavLink includeRouting={includeRouting} to="/groups">
                            Groups
                        </NavLink>
                        <Divider />
                        <NavLink includeRouting={includeRouting} to="/post">
                            Post
                        </NavLink>
                        <Divider />
                        <NavLink includeRouting={includeRouting} to="/settings/notifications">
                            Notification Settings
                        </NavLink>
                        <Divider />
                        <NavLink includeRouting={includeRouting} to="/logout">
                            Logout
                        </NavLink>
                    </List>
                </nav>
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
