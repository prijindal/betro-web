import React from "react";
import { useSelector } from "react-redux";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import { isEmpty } from "lodash";
import { Badge } from "@material-ui/core";
import classes from "./AppDrawer.module.scss";
import NavLink from "../NavLink";
import { getCount, getProfile } from "../../store/app/selectors";

const AppDrawer: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { includeRouting } = props;
    const profile = useSelector(getProfile);
    const countData = useSelector(getCount);
    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            <List>
                <NavLink includeRouting={includeRouting} to="/home">
                    Home
                </NavLink>
                <NavLink includeRouting={includeRouting} to="/notifications">
                    {countData.isLoaded && countData.notifications !== 0 ? (
                        <Badge color="secondary" badgeContent={countData.notifications}>
                            <span>Notifications</span>
                        </Badge>
                    ) : (
                        "Notifications"
                    )}
                </NavLink>
                <NavLink includeRouting={includeRouting} to="/approvals">
                    {countData.isLoaded && countData.approvals !== 0 ? (
                        <Badge color="secondary" badgeContent={countData.approvals}>
                            <span>Approvals</span>
                        </Badge>
                    ) : (
                        "Approvals"
                    )}
                </NavLink>
                <NavLink includeRouting={includeRouting} to="/groups">
                    {countData.isLoaded && countData.groups === 0 ? (
                        <Badge color="secondary" variant="dot">
                            <span>Groups</span>
                        </Badge>
                    ) : (
                        "Groups"
                    )}
                </NavLink>
                <Divider />
                <NavLink includeRouting={includeRouting} to="/post">
                    Post
                </NavLink>
                <Divider />
                <NavLink includeRouting={includeRouting} to="/profile">
                    {profile.isLoaded && isEmpty(profile.first_name) ? (
                        <Badge color="secondary" variant="dot">
                            <span>Profile</span>
                        </Badge>
                    ) : (
                        "Profile"
                    )}
                </NavLink>
                <NavLink includeRouting={includeRouting} to="/settings/notifications">
                    {countData.isLoaded && countData.notificationSettings === 0 ? (
                        <Badge color="secondary" variant="dot">
                            <span>Notification Settings</span>
                        </Badge>
                    ) : (
                        "Notification Settings"
                    )}
                </NavLink>
                <Divider />
                <NavLink includeRouting={includeRouting} to="/logout">
                    Logout
                </NavLink>
            </List>
        </nav>
    );
};

export default AppDrawer;
