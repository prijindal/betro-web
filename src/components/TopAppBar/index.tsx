import React, { useEffect } from "react";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProfile } from "../../store/app/selectors";
import { useFetchCountHook, useFetchWhoami, useFetchProfilePicture } from "../../hooks";
import { UserAvatar } from "../UserListItem/UserAvatar";
import { getPrimaryText } from "../UserListItem/getPrimaryText";

const TopAppBar: React.FunctionComponent<{
    includeRouting: boolean;
    onDrawerToggle: () => void;
}> = (props) => {
    const { includeRouting, onDrawerToggle } = props;
    const profile = useSelector(getProfile);
    const fetchCount = useFetchCountHook();
    const fetchWhoami = useFetchWhoami();
    const fetchProfilePicture = useFetchProfilePicture();
    const hidden = window.innerWidth < 960;
    useEffect(() => {
        if (includeRouting) {
            fetchProfilePicture();
            fetchWhoami();
            fetchCount();
        }
    }, [fetchProfilePicture, fetchWhoami, fetchCount, includeRouting]);
    return (
        <div className="text-white sticky top-0 shadow-appbar max-w bg-purple-500 flex flex-row items-center justify-between p-2">
            {hidden ? (
                <button className="p-2" onClick={onDrawerToggle} aria-label="menu">
                    <MenuIcon />
                </button>
            ) : (
                <Link to="/home" className="p-2" aria-label="menu">
                    <HomeIcon />
                </Link>
            )}
            <span className="text-xl font-medium">Betro</span>
            <div style={{ flex: 1 }}></div>
            <div>
                <UserAvatar user={{ ...profile, username: profile.username || "" }} />
            </div>
            <div className="flex flex-col justify-center ml-4">
                <div className="font-medium text-white text-gray-100 text-sm">
                    {getPrimaryText(profile)}
                </div>
                <div className="font-normal text-gray-300 text-sm">{profile.username}</div>
            </div>
        </div>
    );
};

export default TopAppBar;
