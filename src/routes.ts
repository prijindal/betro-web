const routes = {
    loading: "/",
    login: "/login",
    register: "/register",
    home: "/home",
    user: "/user/:username",
    approvals: "/approvals",
    groups: "/groups",
    post: "/post",
    notifications: "/notifications",
    notificationSettings: "/settings/notifications",
    logout: "/logout",
};

export const getRoute = (
    path: string,
    params?: { [key: string]: string | number },
    routesConfig: any = routes
) =>
    path.split(".").reduce((routeBranch: any, pathItem: string) => {
        if (routeBranch && routeBranch[pathItem]) {
            const route = routeBranch[pathItem];
            if (typeof route === "string") {
                if (!params || typeof params === "undefined") {
                    return route;
                }

                return Object.entries(params).reduce((replaced, [key, value]) => {
                    return replaced.replace(`:${key}`, String(value));
                }, route);
            }
            return routeBranch[pathItem];
        }
        return undefined;
    }, routesConfig);

export default routes;
