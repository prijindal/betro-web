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
}> = ({
    noHoverBg,
    disabled,
    noBorder,
    type,
    outlined,
    onClick,
    children,
    className,
    ...props
}) => {
    const color = props.color || "purple";
    if (outlined) {
        return (
            <button
                onClick={disabled ? undefined : onClick}
                type={type}
                className={`transition-colors bg-transparent text-${color}-700 font-semibold py-2 px-4 rounded ${
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : noHoverBg
                        ? ""
                        : `hover:bg-${color}-500`
                } ${className != null ? className : ""} ${
                    noBorder
                        ? noHoverBg
                            ? "border border-transparent focus:outline-none hover:border-purple-500"
                            : ""
                        : `border border-${color}-500 hover:border-transparent`
                } ${noHoverBg ? "" : "hover:text-white"}`}
            >
                {children}
            </button>
        );
    } else {
        return (
            <button
                onClick={disabled ? undefined : onClick}
                type={type}
                className={`transition-colors bg-${color}-500 text-white font-bold py-2 px-4 rounded ${
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : noHoverBg
                        ? ""
                        : `hover:bg-${color}-700`
                } ${className != null ? className : ""}`}
            >
                {children}
            </button>
        );
    }
};

export default Button;
