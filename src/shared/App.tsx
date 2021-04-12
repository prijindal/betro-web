// import React, { Suspense } from 'react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch } from 'react-router-dom';
import favicon from '../shared/assets/favicon.png';
import { ReactComponent as ReactLogo } from './assets/react.svg';
import PrivateRoute from './components/PrivateRoute';
import Loading from './pages/Loading';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Page1 from './pages/Page-1';
import Page2 from './pages/Page-2';
import routes from './routes';
import css from './App.module.css';

// Does not yet work with server side rendering:
// const Home = React.lazy(() => import('./pages/Home'));
// const Page1 = React.lazy(() => import('./pages/Page-1'));
// const Page2 = React.lazy(() => import('./pages/Page-2'));

const App: React.FC<any> = () => {
    const { t } = useTranslation();
    return (
        // <Suspense fallback={<div>Loading</div>}>
        <div className={css.wrapper}>
            <Helmet
                defaultTitle="React SSR Starter – TypeScript Edition"
                titleTemplate="%s – React SSR Starter – TypeScript Edition"
                link={[{ rel: 'icon', type: 'image/png', href: favicon }]}
            />
            <h1>
                <ReactLogo className={css.reactLogo} /> React + Express – SSR Starter – TypeScript
                Edition
            </h1>
            <Switch>
                <Route exact path={routes.loading} component={Loading} />
                <Route exact path={routes.login} component={Login} />
                <Route exact path={routes.register} component={Register} />
                <PrivateRoute exact path={routes.home}>
                    <Route component={Home} />
                </PrivateRoute>
                <PrivateRoute exact path={routes.home}>
                    <Route component={Home} />
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
