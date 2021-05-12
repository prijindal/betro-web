import React from "react";

const LoadingFullPage: React.FunctionComponent = ({ children }) => (
    <span className="top-0 left-0 flex flex-row justify-center items-center absolute inline-flex h-full w-full bg-purple-50 opacity-75">
        {children || "Loading.."}
        <span
            style={{ left: "-100%", bottom: "100%" }}
            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"
        ></span>
    </span>
);

export default LoadingFullPage;
