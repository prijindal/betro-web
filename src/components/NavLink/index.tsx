import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Icon from "@material-ui/core/Icon";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@material-ui/core";

const NavLinkWithoutRouting: React.FunctionComponent<{ icon?: React.ReactElement }> = (props) => {
    const { children, icon } = props;
    return (
        <ListItem>
            {icon != null && (
                <ListItemIcon>
                    <Icon>{icon}</Icon>
                </ListItemIcon>
            )}
            {children}
        </ListItem>
    );
};

const NavLinkWithRouting: React.FunctionComponent<{
    pathname: string;
    icon?: React.ReactElement;
}> = (props) => {
    const { children, pathname, icon } = props;
    const location = useLocation();
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;
    return (
        <ListItem
            selected={location.pathname === pathname}
            component={location.pathname === pathname ? "span" : Link}
            to={pathname}
            style={{
                color: location.pathname === pathname ? primaryColor : "",
            }}
        >
            {icon != null && (
                <ListItemIcon style={{ color: location.pathname === pathname ? primaryColor : "" }}>
                    {icon}
                </ListItemIcon>
            )}
            {children}
        </ListItem>
    );
};

const NavLink: React.FunctionComponent<{
    icon?: React.ReactElement;
    to: string;
    includeRouting: boolean;
}> = (props) => {
    const { children, to, includeRouting, icon } = props;
    if (includeRouting) {
        return <NavLinkWithRouting icon={icon} children={children} pathname={to} />;
    } else {
        return <NavLinkWithoutRouting icon={icon} children={children} />;
    }
};

export default NavLink;
