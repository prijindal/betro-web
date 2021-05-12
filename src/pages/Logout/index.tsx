import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import BetroApiObject from "../../api/context";
import { resetAuth } from "../../store/app/actions";
import LoadingFullPage from "../../components/LoadingFullPage";

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
    return <LoadingFullPage>Logging Out...</LoadingFullPage>;
};

export default Logout;
