import React, { useEffect, useCallback } from "react";
import AppBar from "@material-ui/core/AppBar";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { isEmpty, throttle } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import classes from "./TopAppBar.module.scss";
import { getAuth, getProfile } from "../../store/app/selectors";
import { fetchProfilePicture, whoAmi } from "../../api/login";
import { profileLoaded, profilePictureLoaded } from "../../store/app/actions";
import { bufferToImageUrl } from "../../util/bufferToImage";

const TopAppBar: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { includeRouting } = props;
    const auth = useSelector(getAuth);
    const profile = useSelector(getProfile);
    const dispatch = useDispatch();

    const fetchWhoami = useCallback(() => {
        if (
            auth.isLoaded &&
            includeRouting &&
            auth.token != null &&
            auth.privateKey !== null &&
            profile.username == null
        ) {
            whoAmi(auth.token, auth.symKey).then(async (resp) => {
                if (resp != null) {
                    dispatch(
                        profileLoaded(
                            resp.user_id,
                            resp.username,
                            resp.email,
                            resp.first_name,
                            resp.last_name
                        )
                    );
                }
            });
        }
    }, [
        dispatch,
        auth.token,
        auth.symKey,
        auth.isLoaded,
        auth.privateKey,
        includeRouting,
        profile.username,
    ]);

    const getProfilePicture = useCallback(() => {
        if (
            auth.isLoaded &&
            includeRouting &&
            auth.token !== null &&
            auth.symKey !== null &&
            profile.profile_picture == null
        ) {
            fetchProfilePicture(auth.token, auth.symKey).then(async (resp) => {
                if (resp != null) {
                    dispatch(profilePictureLoaded(bufferToImageUrl(resp)));
                }
            });
        }
    }, [dispatch, auth.isLoaded, includeRouting, auth.token, auth.symKey, profile.profile_picture]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchWhoamiThrottled = useCallback(throttle(fetchWhoami, 1000), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getProfilePictureThrottled = useCallback(throttle(getProfilePicture, 1000), []);
    useEffect(() => {
        fetchWhoamiThrottled();
        getProfilePictureThrottled();
    }, [getProfilePictureThrottled, fetchWhoamiThrottled]);
    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton
                    component={includeRouting ? Link : "a"}
                    to="/home"
                    href="/home"
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="menu"
                >
                    <HomeIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Betro
                </Typography>
                <div style={{ flex: 1 }}></div>
                <div>
                    {profile.profile_picture && (
                        <img width="30" height="30" src={profile.profile_picture} alt="Profile" />
                    )}
                </div>
                <Typography>
                    {isEmpty(profile.first_name)
                        ? profile.username
                        : `${profile.first_name} ${profile.last_name}`}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default TopAppBar;
