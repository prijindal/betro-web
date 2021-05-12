import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

const liClassName = (selected: boolean) =>
    `p-3 flex flex-row items-center ${
        selected ? "bg-purple-100 text-purple-500 font-medium" : "text-black font-normal"
    }`;

const iconClassName = (selected: boolean) =>
    `pl-2 pr-4 ${selected ? "text-purple-500" : "text-gray-500"}`;

const Chip: React.FunctionComponent<{ selected: boolean }> = ({ children, selected }) => (
    <span
        className={`inline-flex items-center ml-auto rounded-full bg-white border p-px bg-gray-200 text-center mx-1 ${
            selected ? "border-purple-300" : "border-gray-300"
        }`}
    >
        <span style={{ minWidth: "40px" }} className="text-sm">
            {children}
        </span>
    </span>
);

const NavLinkWithoutRouting: React.FunctionComponent<{
    icon?: React.ReactElement;
    chip?: React.ReactElement;
}> = (props) => {
    const { children, icon, chip } = props;
    return (
        <li className={liClassName(false)}>
            {icon != null && <span className={iconClassName(false)}>{icon}</span>}
            {children}
            {chip != null && <Chip selected={false}>{chip}</Chip>}
        </li>
    );
};

const NavLinkWithRouting: React.FunctionComponent<{
    pathname: string;
    icon?: React.ReactElement;
    chip?: React.ReactElement;
}> = (props) => {
    const { children, pathname, icon, chip } = props;
    const history = useHistory();
    const location = useLocation();
    const selected = location.pathname === pathname;
    if (selected) {
        return (
            <span
                className={liClassName(selected)}
                onClick={selected ? undefined : () => history.push(pathname)}
            >
                {icon != null && <span className={iconClassName(selected)}>{icon}</span>}
                {children}
                {chip != null && <Chip selected={selected}>{chip}</Chip>}
            </span>
        );
    }
    return (
        <Link
            to={pathname}
            className={liClassName(selected)}
            onClick={selected ? undefined : () => history.push(pathname)}
        >
            {icon != null && <span className={iconClassName(selected)}>{icon}</span>}
            {children}
            {chip != null && <Chip selected={selected}>{chip}</Chip>}
        </Link>
    );
};

const NavLink: React.FunctionComponent<{
    icon?: React.ReactElement;
    chip?: React.ReactElement;
    to: string;
    includeRouting: boolean;
}> = (props) => {
    const { children, to, includeRouting, icon, chip } = props;
    if (includeRouting) {
        return <NavLinkWithRouting chip={chip} icon={icon} children={children} pathname={to} />;
    } else {
        return <NavLinkWithoutRouting chip={chip} icon={icon} children={children} />;
    }
};

export default NavLink;
