import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { aesDecrypt } from "betro-js-lib";
import { useHistory, useLocation } from "react-router";
import { authLoaded, resetAuth, verifedLogin } from "../../store/app/actions";
import { verifyLogin } from "../../api/login";
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
            verifyLogin(token).then(async (resp) => {
                if (auth.encryptionKey !== null && auth.encryptionMac !== null) {
                    if (!isEmpty(resp) && resp !== null) {
                        const encryptedPrivateKey = resp;
                        const privateKey = await aesDecrypt(
                            auth.encryptionKey,
                            auth.encryptionMac,
                            encryptedPrivateKey
                        );
                        if (privateKey.isVerified) {
                            const state = location.state || { from: { pathname: "/home" } };
                            dispatch(verifedLogin(privateKey.data.toString("base64")));
                            history.replace((state as any).from);
                        } else {
                            const state = { from: { pathname: "/login" } };
                            dispatch(resetAuth());
                            history.replace((state as any).from);
                        }
                    } else {
                        const state = { from: { pathname: "/login" } };
                        dispatch(resetAuth());
                        history.replace((state as any).from);
                    }
                }
            });
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
            <p>
                <div>
                    {auth.isLoaded ? (
                        <span>{auth.isLoggedIn ? "Logging In" : "Logged In"}</span>
                    ) : (
                        <span>Loading</span>
                    )}
                </div>
            </p>
        </React.Fragment>
    );
};

export default App;
