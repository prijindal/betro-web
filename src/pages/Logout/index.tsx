import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { wrapLayout } from "../../components/Layout";
import { getAuth } from "../../store/app/selectors";

const Logout = () => {
    const auth = useSelector(getAuth);
    const history = useHistory();
    const logoutFunction = useCallback(async () => {
        async function fetchgr() {
            if (auth.token !== null) {
                localStorage.clear();
                history.push("/login");
            }
        }
        fetchgr();
    }, [auth.token, history]);
    useEffect(() => {
        logoutFunction();
    }, [logoutFunction]);
    return <div>Loading...</div>;
};

export default wrapLayout(Logout);
