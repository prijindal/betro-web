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
        <div className="flex flex-row h-full">
            {hidden ? (
                <Suspense fallback={<Loading />}>
                    <MobileAppDrawer
                        open={open}
                        setOpen={setOpen}
                        includeRouting={includeRouting}
                    />
                </Suspense>
            ) : (
                <div className="flex flex-row items-start justify-end flex-1">
                    <AppDrawer includeRouting={includeRouting} />
                </div>
            )}
            <div
                className="flex flex-col flex-1 ml-auto mr-auto overflow-auto"
                style={{ flexBasis: "auto" }}
            >
                <div className="flex-1 max-w-5xl" style={{ minWidth: "42rem" }}>
                    <TopAppBar onDrawerToggle={drawerToggle} includeRouting={includeRouting} />
                    <div className="m-1">{children}</div>
                </div>
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
