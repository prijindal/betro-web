import React, { useCallback } from "react";

enum Keys {
    Space = " ",
    Enter = "Enter",
    Tab = "Tab",
}

export interface SwitchProps {
    value: boolean;
    onChange: (b: boolean) => void;
    label?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    labelPosition?: "left" | "right";
}

const defaultProps: SwitchProps = {
    onChange: () => null,
    value: false,
    disabled: false,
    labelPosition: "left",
};

const Switch: React.FunctionComponent<SwitchProps> = ({
    value,
    onChange,
    label,
    className,
    disabled,
    labelPosition,
} = defaultProps) => {
    const toggle = useCallback(() => onChange(!value), [onChange, value]);
    const handleClick = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            toggle();
        },
        [toggle]
    );
    const handleKeyUp = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => {
            if (event.key !== Keys.Tab && event.key !== Keys.Enter) event.preventDefault();
            if (event.key === Keys.Space) toggle();
        },
        [toggle]
    );
    const handleKeyPress = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => event.preventDefault(),
        []
    );
    const LabelComponent = () => (
        <span
            onClick={disabled ? undefined : handleClick}
            className={`transition-colors ${labelPosition === "left" ? "mr-4" : "ml-4"} ${
                disabled ? "text-gray-500" : "text-black"
            }`}
        >
            {label}
        </span>
    );
    return (
        <div className={`flex items-center ${className != null ? className : ""}`}>
            {labelPosition !== "right" && label != null && <LabelComponent />}
            <button
                type="button"
                disabled={disabled}
                onKeyUp={handleKeyUp}
                onKeyPress={handleKeyPress}
                onClick={disabled ? undefined : handleClick}
                className={`${
                    value
                        ? disabled
                            ? "bg-purple-300"
                            : "bg-purple-600"
                        : disabled
                        ? "bg-gray-200"
                        : "bg-gray-400"
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
            >
                <span
                    className={`${
                        value ? "translate-x-6" : "translate-x-1"
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
            </button>
            {labelPosition === "right" && label != null && <LabelComponent />}
        </div>
    );
};

Switch.defaultProps = defaultProps;

export default Switch;
