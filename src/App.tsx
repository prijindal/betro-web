// import React, { Suspense } from 'react';
import * as React from "react";
import { Helmet } from "react-helmet-async";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import createHistory from "./store/history";
import favicon from "./assets/favicon.png";
import routes from "./routes";
import PrivateRoute from "./components/PrivateRoute";
import { useSelector } from "react-redux";
import { getAuth } from "./store/app/selectors";
import { wrapLayout } from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/User";
import Post from "./pages/Post";
import NewPost from "./pages/NewPost";
import Posts from "./pages/Posts";
import Search from "./pages/Search";
import Approvals from "./pages/Approvals";
import Followers from "./pages/Followers";
import Followees from "./pages/Followees";
import Groups from "./pages/Groups";
import Notifications from "./pages/Notifications";
import UserSettings from "./pages/UserSettings";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import LoadingFullPage from "./components/LoadingFullPage";

const history = createHistory();

const LayoutLoading = wrapLayout(() => <LoadingFullPage />, { includeRouting: false });

const LoadingSuspense = () => {
    const auth = useSelector(getAuth);
    if (auth.isLoaded === false) {
        return <LoadingFullPage />;
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
        route: routes.newpost,
        Component: NewPost,
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

const App: React.FC = () => {
    return (
        <React.Suspense fallback={<LoadingSuspense />}>
            <Router history={history}>
                <Helmet
                    defaultTitle="Betro"
                    titleTemplate="%s – Betro"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                />
                <Switch>
                    <Route exact path={routes.loading}>
                        <Redirect to="/home" />
                    </Route>
                    <Route exact path={routes.login}>
                        <Login />
                    </Route>
                    <Route exact path={routes.register}>
                        <Register />
                    </Route>
                    {APP_ROUTES.map(({ route, Component }) => (
                        <PrivateRoute key={route} exact path={route}>
                            <Route>
                                <Component />
                            </Route>
                        </PrivateRoute>
                    ))}
                    <PrivateRoute exact path={routes.search}>
                        <Route>
                            <Search />
                        </Route>
                    </PrivateRoute>
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
