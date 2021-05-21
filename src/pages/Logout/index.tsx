import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import BetroApiObject from "../../api/context";
import { resetAuth } from "../../store/app/actions";
import LoadingFullPage from "../../ui/LoadingFullPage";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const logoutFunction = useCallback(async () => {
        BetroApiObject.auth.logout();
        navigate("/login");
        dispatch(resetAuth());
    }, [navigate, dispatch]);
    useEffect(() => {
        logoutFunction();
    }, [logoutFunction]);
    return <LoadingFullPage>Logging Out...</LoadingFullPage>;
};

export default Logout;
