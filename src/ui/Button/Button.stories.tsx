import React from "react";
import { Story, Meta } from "@storybook/react";
import "../../index.scss";

import Button, { ButtonProps } from "./";

export default {
    title: "UI/Button",
    component: Button,
    argTypes: {
        backgroundColor: { control: "color" },
    },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: "Login",
};

export const Secondary = Template.bind({});
Secondary.args = {
    disabled: true,
    color: "purple",
    children: "Login",
};

export const Large = Template.bind({});
Large.args = {
    outlined: true,
    children: "Login",
};

export const Small = Template.bind({});
Small.args = {
    outlined: true,
    noBorder: true,
    children: "Login",
};
