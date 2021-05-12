import React, { useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Theme } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getProfile } from "../../store/app/selectors";
import { useFetchCountHook, useFetchWhoami, useFetchProfilePicture } from "../../hooks";
import { getPrimaryText, UserAvatar } from "../UserListItem";

const TopAppBar: React.FunctionComponent<{
    includeRouting: boolean;
    onDrawerToggle: () => void;
    position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
}> = (props) => {
    const { includeRouting, onDrawerToggle } = props;
    const profile = useSelector(getProfile);
    const fetchCount = useFetchCountHook();
    const fetchWhoami = useFetchWhoami();
    const fetchProfilePicture = useFetchProfilePicture();
    const hidden = useMediaQuery<Theme>((theme) => theme.breakpoints.down("md"));
    useEffect(() => {
        if (includeRouting) {
            fetchProfilePicture();
            fetchWhoami();
            fetchCount();
        }
    }, [fetchProfilePicture, fetchWhoami, fetchCount, includeRouting]);
    return (
        <AppBar position={props.position || "sticky"}>
            <Toolbar>
                {hidden ? (
                    <IconButton
                        onClick={onDrawerToggle}
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        component={includeRouting ? Link : "a"}
                        to="/home"
                        href="/home"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                    >
                        <HomeIcon />
                    </IconButton>
                )}
                <Typography variant="h6">Betro</Typography>
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
            </Toolbar>
        </AppBar>
    );
};

export default TopAppBar;
