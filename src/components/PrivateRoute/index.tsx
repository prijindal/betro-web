import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import { getAuth } from "../../store/app/selectors";

const PrivateRoute: React.FC<any> = ({ children, ...rest }) => {
    const auth = useSelector(getAuth);
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.isLoaded && auth.isLoggedIn && auth.isVerified ? (
                    children
                ) : auth.isLoaded && !auth.isLoggedIn ? (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location },
                        }}
                    />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
