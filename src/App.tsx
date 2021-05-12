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

const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const User = React.lazy(() => import("./pages/User"));
const Post = React.lazy(() => import("./pages/Post"));
const NewPost = React.lazy(() => import("./pages/NewPost"));
const Posts = React.lazy(() => import("./pages/Posts"));
const Search = React.lazy(() => import("./pages/Search"));
const Approvals = React.lazy(() => import("./pages/Approvals"));
const Followers = React.lazy(() => import("./pages/Followers"));
const Followees = React.lazy(() => import("./pages/Followees"));
const Groups = React.lazy(() => import("./pages/Groups"));
const Notifications = React.lazy(() => import("./pages/Notifications"));
const UserSettings = React.lazy(() => import("./pages/UserSettings"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Logout = React.lazy(() => import("./pages/Logout"));

const history = createHistory();

const LayoutLoading = wrapLayout(() => <p>Loading...</p>, { includeRouting: false });

const LoadingSuspense = () => {
    const auth = useSelector(getAuth);
    if (auth.isLoaded === false) {
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
                        <Loading />
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
