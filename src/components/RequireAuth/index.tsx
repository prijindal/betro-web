import React, { useCallback, useEffect } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { authLoaded, resetAuth, verifedLogin } from "../../store/app/actions";
import { getAuth } from "../../store/app/selectors";
import BetroApiObject from "../../api/context";
import LoadingFullPage from "../../ui/LoadingFullPage";

const CheckLoginLoading = () => {
    const dispatch = useDispatch();
    const auth = useSelector(getAuth);
    const onInit = useCallback(() => {
        const isLoggedIn = BetroApiObject.auth.loadFromLocal();
        dispatch(authLoaded(isLoggedIn));
    }, [dispatch]);

    const login = useCallback(() => {
        if (auth.isLoggedIn && auth.isLoaded) {
            BetroApiObject.keys
                .fetchKeys()
                .then(async (resp) => {
                    if (resp === true) {
                        dispatch(verifedLogin());
                    } else {
                        dispatch(resetAuth());
                    }
                })
                .catch(() => {
                    BetroApiObject.auth.logout();
                    dispatch(resetAuth());
                });
        }
    }, [dispatch, auth.isLoggedIn, auth.isLoaded]);

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
                        <span>{auth.isLoggedIn ? <LoadingFullPage /> : "Logged In"}</span>
                    ) : (
                        <LoadingFullPage />
                    )}
                </p>
            </div>
        </React.Fragment>
    );
};

const RequireAuth: React.FC = ({ children }) => {
    const auth = useSelector(getAuth);
    return auth.isLoaded && auth.isLoggedIn && auth.isVerified ? (
        <div>{children}</div>
    ) : auth.isLoaded && !auth.isLoggedIn ? (
        <Navigate
            to={{
                pathname: "/login",
            }}
        />
    ) : (
        <CheckLoginLoading />
    );
};

export default RequireAuth;
