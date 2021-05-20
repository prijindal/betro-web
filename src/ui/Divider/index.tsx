import React from "react";

export interface DividerProps {
    className?: string;
}

const Divider: React.FunctionComponent<DividerProps> = ({ className } = { className: "" }) => (
    <hr className={`border-0 border-b border-gray-200 ${className}`} />
);

export default Divider;
