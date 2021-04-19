import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";
import { AppState, AuthState } from "../../store/app/types";

const PrivateRoute: React.FC<any> = ({ children, ...rest }) => {
  const auth = useSelector<{ app: AppState }, AuthState>((a) => a.app.auth);
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
