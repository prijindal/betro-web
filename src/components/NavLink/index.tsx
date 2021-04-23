import ListItem from "@material-ui/core/ListItem";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import classes from "./NavLink.module.scss";

const NavLinkWithoutRouting: React.FunctionComponent = (props) => {
    const { children } = props;
    return <ListItem>{children}</ListItem>;
};

const NavLinkWithRouting: React.FunctionComponent<{ pathname: string }> = (props) => {
    const { children, pathname } = props;
    const location = useLocation();
    return (
        <ListItem
            className={classes.listItem}
            selected={location.pathname === pathname}
            disabled={location.pathname === pathname}
            component={location.pathname === pathname ? "span" : Link}
            to={pathname}
        >
            {children}
        </ListItem>
    );
};

const NavLink: React.FunctionComponent<{ to: string; includeRouting: boolean }> = (props) => {
    const { children, to, includeRouting } = props;
    if (includeRouting) {
        return <NavLinkWithRouting children={children} pathname={to} />;
    } else {
        return <NavLinkWithoutRouting children={children} />;
    }
};

export default NavLink;
