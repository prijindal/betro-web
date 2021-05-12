import React, { Suspense, useCallback, useState } from "react";
import TopAppBar from "../TopAppBar";
import AppDrawer from "../AppDrawer";
const MobileAppDrawer = React.lazy(() => import("../AppDrawer/MobileAppDrawer"));

const Loading = () => <div>loading...</div>;

const Layout: React.FunctionComponent<{ includeRouting: boolean }> = (props) => {
    const { children, includeRouting } = props;
    const [open, setOpen] = useState<boolean>(false);
    const hidden = window.innerWidth < 960;
    const drawerToggle = useCallback(() => setOpen(!open), [open]);
    return (
        <div className="flex flex-row h-full overflow-hidden">
            {hidden ? (
                <Suspense fallback={<Loading />}>
                    <MobileAppDrawer
                        open={open}
                        setOpen={setOpen}
                        includeRouting={includeRouting}
                    />
                </Suspense>
            ) : (
                <AppDrawer includeRouting={includeRouting} />
            )}
            <div className="flex-1 overflow-auto ml-auto mr-auto">
                <TopAppBar onDrawerToggle={drawerToggle} includeRouting={includeRouting} />
                <div className="m-1">{children}</div>
            </div>
        </div>
    );
};

export const wrapLayout = (
    children: React.FunctionComponent,
    options: { includeRouting: boolean } = { includeRouting: true }
): React.FunctionComponent => {
    return (props) => <Layout includeRouting={options.includeRouting}>{children(props)}</Layout>;
};

export default Layout;
