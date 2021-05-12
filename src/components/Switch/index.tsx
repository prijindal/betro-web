import React from "react";
import { Switch } from "@headlessui/react";

const SwitchComponent: React.FunctionComponent<{
    value: boolean;
    onChange: (b: boolean) => void;
    label?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    labelPosition?: "left" | "right";
}> = ({ value, onChange, label, className, disabled, labelPosition }) => {
    return (
        <Switch.Group>
            <div className={`flex items-center ${className != null ? className : ""}`}>
                {labelPosition !== "right" && label != null && (
                    <Switch.Label className="mr-4">{label}</Switch.Label>
                )}
                <Switch
                    disabled={disabled}
                    checked={value}
                    onChange={onChange}
                    className={`${
                        value ? "bg-purple-600" : "bg-gray-200"
                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                    <span
                        className={`${
                            value ? "translate-x-6" : "translate-x-1"
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                </Switch>
                {labelPosition === "right" && label != null && (
                    <Switch.Label className="ml-4">{label}</Switch.Label>
                )}
            </div>
        </Switch.Group>
    );
};

export default SwitchComponent;
