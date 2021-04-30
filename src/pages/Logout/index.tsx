import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { resetAuth } from "../../store/app/actions";

const Logout = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const logoutFunction = useCallback(async () => {
        localStorage.clear();
        history.push("/login");
        dispatch(resetAuth());
    }, [history, dispatch]);
    useEffect(() => {
        logoutFunction();
    }, [logoutFunction]);
    return <div>Logging Out...</div>;
};

export default Logout;
