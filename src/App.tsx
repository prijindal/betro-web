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
import Approvals from "./pages/Approvals";
import Groups from "./pages/Groups";
import Notifications from "./pages/Notifications";
import NotificationSettings from "./pages/NotificationSettings";
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
                    <Route exact path={routes.loading} component={Loading} />
                    <Route exact path={routes.login} component={Login} />
                    <Route exact path={routes.register} component={Register} />
                    <PrivateRoute exact path={routes.home}>
                        <Route component={Home} />
                    </PrivateRoute>
                    <PrivateRoute exact path={routes.user}>
                        <Route component={User} />
                    </PrivateRoute>
                    <PrivateRoute exact path={routes.groups}>
                        <Route component={Groups} />
                    </PrivateRoute>
                    <PrivateRoute exact path={routes.approvals}>
                        <Route component={Approvals} />
                    </PrivateRoute>
                    <PrivateRoute exact path={routes.post}>
                        <Route component={Post} />
                    </PrivateRoute>
                    <PrivateRoute exact path={routes.profile}>
                        <Route component={Profile} />
                    </PrivateRoute>
                    <PrivateRoute exact path={routes.notifications}>
                        <Route component={Notifications} />
                    </PrivateRoute>
                    <PrivateRoute exact path={routes.notificationSettings}>
                        <Route component={NotificationSettings} />
                    </PrivateRoute>
                    <PrivateRoute exact path={routes.logout}>
                        <Route component={Logout} />
                    </PrivateRoute>
                    <Route render={() => "404!"} />
                </Switch>
            </Router>
        </React.Suspense>
    );
};

export default App;
