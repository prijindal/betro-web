import isEmpty from "lodash/isEmpty";
import React from "react";

export interface TextFieldProps {
    textarea?: boolean;
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
}

const defaultProps: TextFieldProps = {
    textarea: false,
    value: "",
    onChange: (a) => null,
    type: "text",
};

const TextField: React.FunctionComponent<TextFieldProps> = ({
    textarea,
    value,
    onChange,
    label,
    className,
    disabled,
    type,
    placeholder,
    name,
    required,
    ...props
} = defaultProps) => {
    let error = props.error;
    let borderColorStyles = "border-purple-300 focus:border-purple-700";
    if (required && isEmpty(value)) {
        error = true;
    }
    if (error) {
        borderColorStyles = "border-red-300 focus:border-red-500";
    }
    if (disabled) {
        borderColorStyles = "border-purple-200";
    }
    const underlineStyles = `transition-colors mt-0 block w-full px-0.5 border-0 border-b-2 focus:ring-0 ${borderColorStyles}`;
    return (
        <label
            className={`flex flex-col items-start max-w-sm ${className != null ? className : ""}`}
        >
            {label != null && <span className="text-gray-700">{label}</span>}
            {textarea ? (
                <textarea
                    name={name}
                    disabled={disabled}
                    placeholder={placeholder}
                    required={required}
                    className={underlineStyles}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {value}
                </textarea>
            ) : (
                <input
                    name={name}
                    disabled={disabled}
                    placeholder={placeholder}
                    type={type}
                    required={required}
                    className={underlineStyles}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </label>
    );
};

TextField.defaultProps = defaultProps;

export default TextField;
