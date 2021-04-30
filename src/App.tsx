// import React, { Suspense } from 'react';
import * as React from "react";
import { Helmet } from "react-helmet-async";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "./store/history";
import favicon from "./assets/favicon.png";
import routes from "./routes";
import PrivateRoute from "./components/PrivateRoute";
import Loading from "./pages/Loading";
import { useSelector } from "react-redux";
import { getAuth } from "./store/app/selectors";
import { wrapLayout } from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/User";
import Post from "./pages/Post";
import Posts from "./pages/Posts";
import Approvals from "./pages/Approvals";
import Followers from "./pages/Followers";
import Followees from "./pages/Followees";
import Groups from "./pages/Groups";
import Notifications from "./pages/Notifications";
import UserSettings from "./pages/UserSettings";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";

const history = createHistory();

const LayoutLoading = wrapLayout(() => <p>Loading...</p>, { includeRouting: false });

const LoadingSuspense = () => {
    const auth = useSelector(getAuth);
    if (auth.token === null) {
        return <p>Loading...</p>;
    } else {
        return <LayoutLoading />;
    }
};

const APP_ROUTES = [
    {
        route: routes.home,
        Component: Home,
    },
    {
        route: routes.user,
        Component: User,
    },
    {
        route: routes.posts,
        Component: Posts,
    },
    {
        route: routes.groups,
        Component: Groups,
    },
    {
        route: routes.approvals,
        Component: Approvals,
    },
    {
        route: routes.approvals,
        Component: Approvals,
    },
    {
        route: routes.followers,
        Component: Followers,
    },
    {
        route: routes.followees,
        Component: Followees,
    },
    {
        route: routes.post,
        Component: Post,
    },
    {
        route: routes.profile,
        Component: Profile,
    },
    {
        route: routes.notifications,
        Component: Notifications,
    },
    {
        route: routes.settings,
        Component: UserSettings,
    },
];

const App: React.FC<any> = () => {
    return (
        <React.Suspense fallback={<LoadingSuspense />}>
            <Router history={history}>
                <Helmet
                    defaultTitle="React SSR Starter – TypeScript Edition"
                    titleTemplate="%s – React SSR Starter – TypeScript Edition"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                />
                <Switch>
                    <Route exact path={routes.loading}>
                        <Loading />
                    </Route>
                    <Route exact path={routes.login}>
                        <Login />
                    </Route>
                    <Route exact path={routes.register}>
                        <Register />
                    </Route>
                    {APP_ROUTES.map(({ route, Component }) => (
                        <PrivateRoute exact path={route}>
                            <Route>
                                <Component />
                            </Route>
                        </PrivateRoute>
                    ))}
                    <Route exact path={routes.logout}>
                        <Logout />
                    </Route>
                    <Route>404</Route>
                </Switch>
            </Router>
        </React.Suspense>
    );
};

export default App;
