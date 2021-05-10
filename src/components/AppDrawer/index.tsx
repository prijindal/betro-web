import React from "react";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import Badge from "@material-ui/core/Badge";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";
import GroupsIcon from "@material-ui/icons/Groups";
import ApprovalIcon from "@material-ui/icons/Approval";
import PeopleIcon from "@material-ui/icons/People";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import AddIcon from "@material-ui/icons/Add";
import FeedIcon from "@material-ui/icons/Feed";
import ManageAccountsIcon from "@material-ui/icons/ManageAccounts";
import SettingsIcon from "@material-ui/icons/Settings";
import SearchIcon from "@material-ui/icons/Search";
import LogoutIcon from "@material-ui/icons/Logout";
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
                <NavLink icon={<HomeIcon />} includeRouting={includeRouting} to="/home">
                    <ListItemText>Home</ListItemText>
                </NavLink>
                <NavLink
                    icon={<NotificationsIcon />}
                    includeRouting={includeRouting}
                    to="/notifications"
                >
                    <ListItemText>Notifications</ListItemText>
                    {countData.isLoaded && countData.notifications !== 0 && (
                        <Chip
                            className={classes.chip}
                            color="secondary"
                            size="small"
                            label={countData.notifications}
                        />
                    )}
                </NavLink>
                <NavLink icon={<ApprovalIcon />} includeRouting={includeRouting} to="/approvals">
                    <ListItemText>Approvals</ListItemText>
                    {countData.isLoaded && countData.approvals !== 0 && (
                        <Chip
                            className={classes.chip}
                            color="secondary"
                            size="small"
                            label={countData.approvals}
                        />
                    )}
                </NavLink>
                <NavLink icon={<GroupsIcon />} includeRouting={includeRouting} to="/groups">
                    <ListItemText>
                        {countData.isLoaded && countData.groups === 0 ? (
                            <Badge color="secondary" variant="dot">
                                <span>Groups</span>
                            </Badge>
                        ) : (
                            "Groups"
                        )}
                    </ListItemText>
                </NavLink>
                <Divider />
                <NavLink icon={<PeopleIcon />} includeRouting={includeRouting} to="/followers">
                    <ListItemText>Followers</ListItemText>
                    {countData.isLoaded && countData.followers !== 0 && (
                        <Chip className={classes.chip} size="small" label={countData.followers} />
                    )}
                </NavLink>
                <NavLink
                    icon={<SupervisorAccountIcon />}
                    includeRouting={includeRouting}
                    to="/followees"
                >
                    <ListItemText>Followees</ListItemText>
                    {countData.isLoaded && countData.followees !== 0 && (
                        <Chip className={classes.chip} size="small" label={countData.followees} />
                    )}
                </NavLink>
                <Divider />
                <NavLink icon={<AddIcon />} includeRouting={includeRouting} to="/newpost">
                    <ListItemText>Post</ListItemText>
                </NavLink>
                <NavLink icon={<FeedIcon />} includeRouting={includeRouting} to="/posts">
                    <ListItemText>My Posts</ListItemText>
                    {countData.isLoaded && countData.posts !== 0 && (
                        <Chip className={classes.chip} size="small" label={countData.posts} />
                    )}
                </NavLink>
                <Divider />
                <NavLink icon={<SearchIcon />} includeRouting={includeRouting} to="/search">
                    <ListItemText>Search</ListItemText>
                </NavLink>
                <Divider />
                <NavLink
                    icon={<ManageAccountsIcon />}
                    includeRouting={includeRouting}
                    to="/profile"
                >
                    <ListItemText>
                        {profile.isLoaded && isEmpty(profile.first_name) ? (
                            <Badge color="secondary" variant="dot">
                                <span>Profile</span>
                            </Badge>
                        ) : (
                            "Profile"
                        )}
                    </ListItemText>
                </NavLink>
                <NavLink icon={<SettingsIcon />} includeRouting={includeRouting} to="/settings">
                    <ListItemText>
                        {countData.isLoaded && countData.settings === 0 ? (
                            <Badge color="secondary" variant="dot">
                                <span>Settings</span>
                            </Badge>
                        ) : (
                            "Settings"
                        )}
                    </ListItemText>
                </NavLink>
                <Divider />
                <NavLink icon={<LogoutIcon />} includeRouting={includeRouting} to="/logout">
                    <ListItemText>Logout</ListItemText>
                </NavLink>
            </List>
        </nav>
    );
};

export default AppDrawer;
