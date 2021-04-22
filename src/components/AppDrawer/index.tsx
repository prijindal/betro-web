import React from "react";
import { useSelector } from "react-redux";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import { isEmpty } from "lodash";
import { Badge } from "@material-ui/core";
import classes from "./AppDrawer.module.scss";
import NavLink from "../NavLink";
import { getGroup, getProfile } from "../../store/app/selectors";

const AppDrawer: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { includeRouting } = props;
    const profile = useSelector(getProfile);
    const groupData = useSelector(getGroup);
    return (
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
                    {groupData.isLoaded && isEmpty(groupData.data) ? (
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
                    Notification Settings
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
