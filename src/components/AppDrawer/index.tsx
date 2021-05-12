import React from "react";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import HomeIcon from "@heroicons/react/solid/HomeIcon";
import BellIcon from "@heroicons/react/solid/BellIcon";
import UserGroupIcon from "@heroicons/react/solid/UserGroupIcon";
import UserAddIcon from "@heroicons/react/solid/UserAddIcon";
import UsersIcon from "@heroicons/react/solid/UsersIcon";
import PlusIcon from "@heroicons/react/solid/PlusIcon";
import ViewListIcon from "@heroicons/react/outline/ViewListIcon";
import SearchIcon from "@heroicons/react/outline/SearchIcon";
import UserCircleIcon from "@heroicons/react/solid/UserCircleIcon";
import CogIcon from "@heroicons/react/solid/CogIcon";
import LogoutIcon from "@heroicons/react/solid/LogoutIcon";
import classes from "./AppDrawer.module.scss";
import NavLink from "../NavLink";
import { getCount, getProfile } from "../../store/app/selectors";
import { CountState } from "../../store/app/types";
import Divider from "../Divider";

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
                <NavLink
                    icon={<HomeIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/home"
                >
                    <span>Home</span>
                </NavLink>
                <NavLink
                    icon={<BellIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/notifications"
                    chip={getChipComponent(countData, "notifications")}
                >
                    <span>Notifications</span>
                </NavLink>
                <NavLink
                    icon={<UserAddIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/approvals"
                    chip={getChipComponent(countData, "approvals")}
                >
                    <span>Approvals</span>
                </NavLink>
                <NavLink
                    icon={<UserGroupIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/groups"
                >
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
                    icon={<UsersIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/followers"
                    chip={getChipComponent(countData, "followers")}
                >
                    <span>Followers</span>
                </NavLink>
                <NavLink
                    icon={<UsersIcon className="heroicon" style={{ transform: "scaleX(-1)" }} />}
                    includeRouting={includeRouting}
                    to="/followees"
                    chip={getChipComponent(countData, "followees")}
                >
                    <span>Followees</span>
                </NavLink>
                <Divider />
                <NavLink
                    icon={<PlusIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/newpost"
                >
                    <span>Post</span>
                </NavLink>
                <NavLink
                    icon={<ViewListIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/posts"
                    chip={getChipComponent(countData, "posts")}
                >
                    <span>My Posts</span>
                </NavLink>
                <Divider />
                <NavLink
                    icon={<SearchIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/search"
                >
                    <span>Search</span>
                </NavLink>
                <Divider />
                <NavLink
                    icon={<UserCircleIcon className="heroicon" />}
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
                <NavLink
                    icon={<CogIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/settings"
                >
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
                <NavLink
                    icon={<LogoutIcon className="heroicon" />}
                    includeRouting={includeRouting}
                    to="/logout"
                >
                    <span>Logout</span>
                </NavLink>
            </ul>
        </nav>
    );
};

export default AppDrawer;
