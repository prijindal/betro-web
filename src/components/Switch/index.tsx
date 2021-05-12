import React, { useCallback } from "react";

enum Keys {
    Space = " ",
    Enter = "Enter",
    Tab = "Tab",
}

const SwitchComponent: React.FunctionComponent<{
    value: boolean;
    onChange: (b: boolean) => void;
    label?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    labelPosition?: "left" | "right";
}> = ({ value, onChange, label, className, disabled, labelPosition }) => {
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
            console.log(event.key);
            if (event.key !== Keys.Tab && event.key !== Keys.Enter) event.preventDefault();
            if (event.key === Keys.Space) toggle();
        },
        [toggle]
    );
    const handleKeyPress = useCallback(
        (event: React.KeyboardEvent<HTMLElement>) => event.preventDefault(),
        []
    );
    return (
        <div className={`flex items-center ${className != null ? className : ""}`}>
            {labelPosition !== "right" && label != null && <span className="mr-4">{label}</span>}
            <button
                type="button"
                disabled={disabled}
                onKeyUp={handleKeyUp}
                onKeyPress={handleKeyPress}
                onClick={handleClick}
                className={`${
                    value
                        ? disabled
                            ? "bg-purple-400"
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
            {labelPosition === "right" && label != null && <label className="ml-4">{label}</label>}
        </div>
    );
};

export default SwitchComponent;
