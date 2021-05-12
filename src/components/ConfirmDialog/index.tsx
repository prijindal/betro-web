import React from "react";

import { ConfirmDialogProps } from "./types";
const ConfirmDialog = React.lazy(() => import("./ConfirmDialog"));

const Loading = () => <div></div>;

const ConfirmDialogWrapper: React.FunctionComponent<ConfirmDialogProps> = (props) => {
    return props.open ? (
        <React.Suspense fallback={<Loading />}>
            <ConfirmDialog {...props} />
        </React.Suspense>
    ) : (
        <div />
    );
};

export default ConfirmDialogWrapper;
