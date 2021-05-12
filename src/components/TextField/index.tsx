import React from "react";

const TextField: React.FunctionComponent<{
    value: string;
    onChange: (e: string) => void;
    label?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    required?: boolean;
    placeholder?: string;
    name?: string;
    type: "text" | "email" | "password";
    styleType?: "solid" | "underline";
}> = ({
    value,
    onChange,
    label,
    className,
    error,
    disabled,
    type,
    styleType,
    placeholder,
    name,
    required,
}) => {
    const solidStyles =
        "mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0";
    const underlineStyles = `mt-0 block w-full px-0.5 border-0 border-b-2 ${
        error ? "border-red-200 focus:border-red-500" : "border-purple-200 focus:border-purple-500"
    } focus:ring-0`;
    return (
        <label
            className={`flex flex-col items-start max-w-sm ${className != null ? className : ""}`}
        >
            {label != null && <span className="text-gray-700">{label}</span>}
            <input
                name={name}
                disabled={disabled}
                placeholder={placeholder}
                type={type}
                required={required}
                className={styleType === "solid" ? solidStyles : underlineStyles}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
};

export default TextField;
