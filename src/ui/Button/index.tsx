import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    outlined?: boolean;
    onClick?: () => void;
    noBorder?: boolean;
    color?: "purple" | "gray";
    noHoverBg?: boolean;
    size?: "small" | "medium";
    disabled?: boolean;
    className?: string;
    type?: "submit" | "reset" | "button";
    children?: React.ReactNode;
}

const defaultProps: ButtonProps = { color: "purple" };

const Button: React.FunctionComponent<ButtonProps> = ({
    noHoverBg,
    disabled,
    noBorder,
    outlined,
    onClick,
    children,
    className,
    size,
    color,
    ...props
} = defaultProps) => {
    let internalClassName = "";
    if (outlined) {
        internalClassName += " transition-colors bg-transparent font-semibold rounded";
        if (noBorder && !noHoverBg) {
            internalClassName += ` border border-transparent focus:outline-none`;
        }
        if (!noBorder) {
            internalClassName += " border hover:border-transparent";
        }
        if (!noHoverBg) {
            internalClassName += " hover:text-white";
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
        internalClassName += " px-2 py-1 text-sm";
    } else {
        internalClassName += " px-4 py-2 text-base";
    }
    if (color === "purple") {
        internalClassName += ` ${outlined ? "text-purple-700" : "bg-purple-700"}`;
        if (!noHoverBg) {
            if (outlined) {
                internalClassName += " hover:bg-purple-700";
            } else {
                internalClassName += " hover:bg-purple-900";
            }
        }
        if (noBorder) {
            internalClassName += " border-purple-500";
        }
    } else {
        internalClassName += ` ${outlined ? "text-gray-700" : "bg-gray-500"}`;
        if (!noHoverBg) {
            if (outlined) {
                internalClassName += " hover:bg-gray-500";
            } else {
                internalClassName += " hover:bg-gray-700";
            }
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

Button.defaultProps = defaultProps;

export default Button;
