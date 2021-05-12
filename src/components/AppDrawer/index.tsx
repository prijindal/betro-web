import React from "react";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
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
import { CountState } from "../../store/app/types";

const Divider = () => <hr className="border-0 border-b border-gray-200" />;

const Badge: React.FunctionComponent = ({ children }) => {
    return (
        <span className="relative inline-flex align-middle flex-shrink">
            {children}
            <span
                className="flex flex-row justify-center items-center absolute box-border text-sm w-2 h-2 rounded-full bg-pink-500 top-0 right-0 origin-top-right"
                style={{
                    transform: "scale(1) translate(50%, -50%)",
                }}
            ></span>
        </span>
    );
};

const getChipComponent = (
    countData: CountState,
    key: "notifications" | "posts" | "approvals" | "followers" | "followees"
) =>
    countData.isLoaded && countData[key] != null && (countData[key] as number) > 0 ? (
        <span>{countData[key]}</span>
    ) : undefined;

const AppDrawer: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { includeRouting } = props;
    const profile = useSelector(getProfile);
    const countData = useSelector(getCount);
    return (
        <nav
            className={`flex flex-col justify-center ${classes.drawer}`}
            aria-label="mailbox folders"
        >
            <ul>
                <NavLink icon={<HomeIcon />} includeRouting={includeRouting} to="/home">
                    <span>Home</span>
                </NavLink>
                <NavLink
                    icon={<NotificationsIcon />}
                    includeRouting={includeRouting}
                    to="/notifications"
                    chip={getChipComponent(countData, "notifications")}
                >
                    <span>Notifications</span>
                </NavLink>
                <NavLink
                    icon={<ApprovalIcon />}
                    includeRouting={includeRouting}
                    to="/approvals"
                    chip={getChipComponent(countData, "approvals")}
                >
                    <span>Approvals</span>
                </NavLink>
                <NavLink icon={<GroupsIcon />} includeRouting={includeRouting} to="/groups">
                    <span>
                        {countData.isLoaded && countData.groups === 0 ? (
                            <Badge>
                                <span>Groups</span>
                            </Badge>
                        ) : (
                            "Groups"
                        )}
                    </span>
                </NavLink>
                <Divider />
                <NavLink
                    icon={<PeopleIcon />}
                    includeRouting={includeRouting}
                    to="/followers"
                    chip={getChipComponent(countData, "followers")}
                >
                    <span>Followers</span>
                </NavLink>
                <NavLink
                    icon={<SupervisorAccountIcon />}
                    includeRouting={includeRouting}
                    to="/followees"
                    chip={getChipComponent(countData, "followees")}
                >
                    <span>Followees</span>
                </NavLink>
                <Divider />
                <NavLink icon={<AddIcon />} includeRouting={includeRouting} to="/newpost">
                    <span>Post</span>
                </NavLink>
                <NavLink
                    icon={<FeedIcon />}
                    includeRouting={includeRouting}
                    to="/posts"
                    chip={getChipComponent(countData, "posts")}
                >
                    <span>My Posts</span>
                </NavLink>
                <Divider />
                <NavLink icon={<SearchIcon />} includeRouting={includeRouting} to="/search">
                    <span>Search</span>
                </NavLink>
                <Divider />
                <NavLink
                    icon={<ManageAccountsIcon />}
                    includeRouting={includeRouting}
                    to="/profile"
                >
                    <span>
                        {profile.isLoaded && isEmpty(profile.first_name) ? (
                            <Badge>
                                <span>Profile</span>
                            </Badge>
                        ) : (
                            "Profile"
                        )}
                    </span>
                </NavLink>
                <NavLink icon={<SettingsIcon />} includeRouting={includeRouting} to="/settings">
                    <span>
                        {countData.isLoaded && countData.settings === 0 ? (
                            <Badge>
                                <span>Settings</span>
                            </Badge>
                        ) : (
                            "Settings"
                        )}
                    </span>
                </NavLink>
                <Divider />
                <NavLink icon={<LogoutIcon />} includeRouting={includeRouting} to="/logout">
                    <span>Logout</span>
                </NavLink>
            </ul>
        </nav>
    );
};

export default AppDrawer;
