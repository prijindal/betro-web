import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink: React.FunctionComponent<{ pathname: string }> = (props) => {
    const { children, pathname } = props;
    const location = useLocation();
    return (
        <li className={location.pathname === pathname ? "uk-active" : ""}>
            <Link to={pathname}>{children}</Link>
        </li>
    );
};

const Layout: React.FunctionComponent = (props) => {
    const { children } = props;
    return (
        <div className="uk-child-width-expand uk-grid uk-grid-small">
            <div className="" style={{ maxWidth: "200px" }}>
                <ul className="uk-nav uk-nav-default">
                    <NavLink pathname="/home">Home</NavLink>
                    <NavLink pathname="/notifications">Notifications</NavLink>
                    <NavLink pathname="/approvals">Approvals</NavLink>
                    <NavLink pathname="/groups">Groups</NavLink>
                    <li className="uk-nav-divider"></li>
                    <NavLink pathname="/post">Post</NavLink>
                    <li className="uk-nav-divider"></li>
                    <NavLink pathname="/settings/notifications">Notification Settings</NavLink>
                    <li className="uk-nav-divider"></li>
                    <NavLink pathname="/logout">Logout</NavLink>
                </ul>
            </div>
            <div>{children}</div>
        </div>
    );
};

export default Layout;
