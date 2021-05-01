import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import BetroApiObject from "../../api/context";
import { resetAuth } from "../../store/app/actions";

const Logout = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const logoutFunction = useCallback(async () => {
        BetroApiObject.auth.logout();
        history.push("/login");
        dispatch(resetAuth());
    }, [history, dispatch]);
    useEffect(() => {
        logoutFunction();
    }, [logoutFunction]);
    return <div>Logging Out...</div>;
};

export default Logout;
