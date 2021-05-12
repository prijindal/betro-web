import React from "react";

const Button: React.FunctionComponent<{
    disabled?: boolean;
    outlined?: boolean;
    onClick?: () => void;
    type?: "submit" | "button" | "reset";
    className?: string;
    noBorder?: boolean;
    color?: "purple" | "gray";
    noHoverBg?: boolean;
    size?: "small" | "medium";
}> = ({
    noHoverBg,
    disabled,
    noBorder,
    type,
    outlined,
    onClick,
    children,
    className,
    size,
    ...props
}) => {
    const color = props.color || "purple";
    let internalClassName = `transition-colors bg-transparent text-${color}-700 font-semibold rounded ${
        disabled ? "opacity-50 cursor-not-allowed" : noHoverBg ? "" : `hover:bg-${color}-500`
    } ${className != null ? className : ""} ${
        noBorder
            ? noHoverBg
                ? "border border-transparent focus:outline-none hover:border-purple-500"
                : ""
            : `border border-${color}-500 hover:border-transparent`
    } ${noHoverBg ? "" : "hover:text-white"}`;
    if (outlined !== true) {
        internalClassName = `transition-colors bg-${color}-500 text-white font-bold rounded ${
            disabled ? "opacity-50 cursor-not-allowed" : noHoverBg ? "" : `hover:bg-${color}-700`
        } ${className != null ? className : ""}`;
    }
    if (size === "small") {
        internalClassName += " px-2";
    } else {
        internalClassName += " px-4 py-2";
    }
    return (
        <button onClick={disabled ? undefined : onClick} type={type} className={internalClassName}>
            {children}
        </button>
    );
};

export default Button;