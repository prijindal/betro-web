import React from "react";
import { Story, Meta } from "@storybook/react";
import "../../index.scss";

import Button, { ButtonProps } from "./";

export default {
    title: "UI/Button",
    component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: "Login",
};

export const Secondary = Template.bind({});
Secondary.args = {
    color: "purple",
    children: "Login",
};

export const SecondaryDisabled = Template.bind({});
SecondaryDisabled.args = {
    disabled: true,
    color: "purple",
    children: "Login",
};

export const Outlined = Template.bind({});
Outlined.args = {
    outlined: true,
    children: "Login",
};

export const Small = Template.bind({});
Small.args = {
    outlined: true,
    size: "small",
    children: "Login",
};
