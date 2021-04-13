import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { authLoaded, resetAuth, verifedLogin } from 'store/app/actions';
import { AppState, AuthState } from 'store/app/types';
import { verifyLogin } from 'api/login';

const App: React.FC<any> = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const auth = useSelector<{ app: AppState }, AuthState>((s) => s.app.auth);
    const onInit = useCallback(() => {
        const encryptionKey = localStorage.getItem('ENCRYPTION_KEY');
        const encryptionMac = localStorage.getItem('ENCRYPTION_MAC');
        const token = localStorage.getItem('TOKEN');
        dispatch(authLoaded(encryptionKey, encryptionMac, token));
        if (token === null && encryptionKey === null && encryptionMac === null) {
            const state = location.state || { from: { pathname: '/login' } };
            history.replace((state as any).from);
        }
    }, [dispatch, location, history]);

    const login = useCallback(
        (token: string) => {
            verifyLogin(token).then((resp) => {
                if (resp) {
                    const state = location.state || { from: { pathname: '/home' } };
                    dispatch(verifedLogin());
                    history.replace((state as any).from);
                } else {
                    const state = location.state || { from: { pathname: '/login' } };
                    dispatch(resetAuth());
                    history.replace((state as any).from);
                }
            });
        },
        [dispatch, location, history]
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
                <span>
                    {auth.isLoaded ? (
                        <span>{auth.isLoggedIn ? 'Logging In' : 'Logged In'}</span>
                    ) : (
                        'Loading'
                    )}
                </span>
            </p>
        </React.Fragment>
    );
};

export default App;
