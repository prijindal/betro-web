import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    outlined?: boolean;
    onClick?: () => void;
    noBorder?: boolean;
    color?: "purple" | "gray";
    noHoverBg?: boolean;
    size?: "small" | "medium";
}

const Button: React.FunctionComponent<ButtonProps> = ({
    noHoverBg,
    disabled,
    noBorder,
    outlined,
    onClick,
    children,
    className,
    size,
    ...props
}) => {
    const color = props.color || "purple";
    let internalClassName = "";
    if (outlined) {
        internalClassName += " transition-colors bg-transparent font-semibold rounded";
        if (noBorder && !noHoverBg) {
            internalClassName += ` border border-transparent focus:outline-none hover:text-white `;
        }
        if (!noBorder) {
            internalClassName += " border hover:border-transparent";
        }
    } else {
        internalClassName += " transition-colors text-white font-bold rounded";
    }
    if (disabled) {
        internalClassName += " opacity-50 cursor-not-allowed";
    }
    if (className != null) {
        internalClassName += ` ${className}`;
    }
    if (size === "small") {
        internalClassName += " px-2";
    } else {
        internalClassName += " px-4 py-2";
    }
    if (color === "purple") {
        internalClassName += ` ${outlined ? "text-purple-700" : "bg-purple-700"}`;
        if (!noHoverBg) {
            internalClassName += " hover:bg-purple-900";
        }
        if (noBorder) {
            internalClassName += " border-purple-500";
        }
    } else {
        internalClassName += ` ${outlined ? "text-gray-700" : "bg-gray-500"}`;
        if (!noHoverBg) {
            internalClassName += " hover:bg-gray-700";
        }
        if (noBorder) {
            internalClassName += " border-gray-500";
        }
    }
    return (
        <button onClick={disabled ? undefined : onClick} {...props} className={internalClassName}>
            {children}
        </button>
    );
};

export default Button;
