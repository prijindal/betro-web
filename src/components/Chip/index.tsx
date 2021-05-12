import React from "react";
const Chip: React.FunctionComponent<{ selected: boolean }> = ({ children, selected }) => (
    <span
        className={`inline-flex items-center ml-auto rounded-full bg-white border p-px bg-gray-200 text-center mx-1 ${
            selected ? "border-purple-300" : "border-gray-300"
        }`}
    >
        <span style={{ minWidth: "40px" }} className="text-sm px-2">
            {children}
        </span>
    </span>
);

export default Chip;
