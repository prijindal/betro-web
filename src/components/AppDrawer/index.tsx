import React from "react";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import Badge from "@material-ui/core/Badge";
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
                    <ListItemText>Home</ListItemText>
                </NavLink>
                <NavLink includeRouting={includeRouting} to="/notifications">
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
                <NavLink includeRouting={includeRouting} to="/approvals">
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
                <NavLink includeRouting={includeRouting} to="/groups">
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
                <NavLink includeRouting={includeRouting} to="/followers">
                    <ListItemText>Followers</ListItemText>
                    {countData.isLoaded && countData.followers !== 0 && (
                        <Chip className={classes.chip} size="small" label={countData.followers} />
                    )}
                </NavLink>
                <NavLink includeRouting={includeRouting} to="/followees">
                    <ListItemText>Followees</ListItemText>
                    {countData.isLoaded && countData.followees !== 0 && (
                        <Chip className={classes.chip} size="small" label={countData.followees} />
                    )}
                </NavLink>
                <Divider />
                <NavLink includeRouting={includeRouting} to="/newpost">
                    <ListItemText>Post</ListItemText>
                </NavLink>
                <NavLink includeRouting={includeRouting} to="/posts">
                    <ListItemText>My Posts</ListItemText>
                    {countData.isLoaded && countData.posts !== 0 && (
                        <Chip className={classes.chip} size="small" label={countData.posts} />
                    )}
                </NavLink>
                <Divider />
                <NavLink includeRouting={includeRouting} to="/search">
                    <ListItemText>Search</ListItemText>
                </NavLink>
                <Divider />
                <NavLink includeRouting={includeRouting} to="/profile">
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
                <NavLink includeRouting={includeRouting} to="/settings">
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
                <NavLink includeRouting={includeRouting} to="/logout">
                    <ListItemText>Logout</ListItemText>
                </NavLink>
            </List>
        </nav>
    );
};

export default AppDrawer;
