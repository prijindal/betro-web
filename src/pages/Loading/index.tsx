import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { authLoaded, resetAuth, verifedLogin } from "../../store/app/actions";
import { getAuth } from "../../store/app/selectors";
import BetroApiObject from "../../api/context";

const App: React.FC<any> = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const auth = useSelector(getAuth);
    const onInit = useCallback(() => {
        const isLoggedIn = BetroApiObject.auth.loadFromLocal();
        console.log(isLoggedIn);
        dispatch(authLoaded(isLoggedIn));
        if (!isLoggedIn) {
            const state = location.state || { from: { pathname: "/login" } };
            history.replace((state as any).from);
        }
    }, [dispatch, location, history]);

    const login = useCallback(() => {
        if (auth.isLoggedIn && auth.isLoaded) {
            BetroApiObject.account.fetchKeys().then(async (resp) => {
                if (resp === true) {
                    dispatch(verifedLogin());
                    const state = location.state || { from: { pathname: "/home" } };
                    history.replace((state as any).from);
                } else {
                    const state = { from: { pathname: "/login" } };
                    dispatch(resetAuth());
                    history.replace((state as any).from);
                }
            });
        }
    }, [dispatch, location, history, auth.isLoggedIn, auth.isLoaded]);

    useEffect(() => {
        onInit();
    }, [onInit]);

    useEffect(() => {
        if (auth.isLoaded && auth.isLoggedIn) {
            login();
        }
    }, [auth.isLoaded, auth.isLoggedIn, login]);

    return (
        <React.Fragment>
            <div>
                <p>
                    {auth.isLoaded ? (
                        <span>{auth.isLoggedIn ? "Logging In" : "Logged In"}</span>
                    ) : (
                        <span>Loading</span>
                    )}
                </p>
            </div>
        </React.Fragment>
    );
};

export default App;
