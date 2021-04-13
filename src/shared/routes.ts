/* eslint-disable security/detect-object-injection */
const routes = {
    loading: '/',
    login: '/login',
    register: '/register',
    home: '/home',
    user: '/user/:user_id',
    approvals: '/approvals',
    groups: '/groups',
    post: '/post',
    page1: '/page-1',
    page2: '/page-2',
};

export const getRoute = (
    path: string,
    params?: { [key: string]: string | number },
    routesConfig: any = routes
) =>
    path.split('.').reduce((routeBranch: any, pathItem: string) => {
        if (routeBranch && routeBranch[pathItem]) {
            const route = routeBranch[pathItem];
            if (typeof route === 'string') {
                if (!params || typeof params === 'undefined') {
                    return route;
                }

                return Object.entries(params).reduce((replaced, [key, value]) => {
                    return replaced.replace(`:${key}`, String(value));
                }, route);
            }
            return routeBranch[pathItem];
        }
    }, routesConfig);

export default routes;
