// import React, { Suspense } from 'react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Switch } from 'react-router-dom';
import favicon from '../shared/assets/favicon.png';
import PrivateRoute from './components/PrivateRoute';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import User from './pages/User';
import Post from './pages/Post';
import Approvals from './pages/Approvals';
import Groups from './pages/Groups';
import Notifications from './pages/Notifications';
import NotificationSettings from './pages/NotificationSettings';
import Page1 from './pages/Page-1';
import Page2 from './pages/Page-2';
import routes from './routes';
import css from './App.module.css';

// Does not yet work with server side rendering:
// const Home = React.lazy(() => import('./pages/Home'));
// const Page1 = React.lazy(() => import('./pages/Page-1'));
// const Page2 = React.lazy(() => import('./pages/Page-2'));

const App: React.FC<any> = () => {
    return (
        // <Suspense fallback={<div>Loading</div>}>
        <div className={css.wrapper}>
            <Helmet
                defaultTitle="React SSR Starter – TypeScript Edition"
                titleTemplate="%s – React SSR Starter – TypeScript Edition"
                link={[{ rel: 'icon', type: 'image/png', href: favicon }]}
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
                <PrivateRoute exact path={routes.notifications}>
                    <Route component={Notifications} />
                </PrivateRoute>
                <PrivateRoute exact path={routes.notificationSettings}>
                    <Route component={NotificationSettings} />
                </PrivateRoute>
                <PrivateRoute exact path={routes.page1}>
                    <Route component={Page1} />
                </PrivateRoute>
                <PrivateRoute exact path={routes.page2}>
                    <Route component={Page2} />
                </PrivateRoute>
                <Route render={() => '404!'} />
            </Switch>
        </div>
        // </Suspense>
    );
};

export default App;
