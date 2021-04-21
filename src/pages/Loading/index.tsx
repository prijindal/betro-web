import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useHistory, useLocation } from "react-router";
import { authLoaded, resetAuth, verifedLogin } from "../../store/app/actions";
import { fetchKeys } from "../../api/login";
import { getAuth } from "../../store/app/selectors";

const App: React.FC<any> = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const auth = useSelector(getAuth);
    const onInit = useCallback(() => {
        const encryptionKey = localStorage.getItem("ENCRYPTION_KEY");
        const encryptionMac = localStorage.getItem("ENCRYPTION_MAC");
        const token = localStorage.getItem("TOKEN");
        dispatch(authLoaded(encryptionKey, encryptionMac, token));
        if (token === null && encryptionKey === null && encryptionMac === null) {
            const state = location.state || { from: { pathname: "/login" } };
            history.replace((state as any).from);
        }
    }, [dispatch, location, history]);

    const login = useCallback(
        (token: string) => {
            if (auth.encryptionKey !== null && auth.encryptionMac !== null) {
                fetchKeys(token, auth.encryptionKey, auth.encryptionMac).then(async (resp) => {
                    if (!isEmpty(resp) && resp !== null) {
                        const private_key = resp.private_key;
                        const sym_key = resp.sym_key;
                        dispatch(verifedLogin(private_key, sym_key));
                        const state = location.state || { from: { pathname: "/home" } };
                        history.replace((state as any).from);
                    } else {
                        const state = { from: { pathname: "/login" } };
                        dispatch(resetAuth());
                        history.replace((state as any).from);
                    }
                });
            }
        },
        [dispatch, location, history, auth.encryptionKey, auth.encryptionMac]
    );

    useEffect(() => {
        onInit();
    }, [onInit]);

    useEffect(() => {
        if (auth.isLoaded) {
            if (auth.token !== null) {
                login(auth.token as string);
            }
        }
    }, [auth.isLoaded, auth.token, login]);

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
