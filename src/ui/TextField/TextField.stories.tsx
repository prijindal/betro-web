import React from "react";
import { Story, Meta } from "@storybook/react";
import "../../index.scss";

import TextField, { TextFieldProps } from "./";

export default {
    title: "UI/TextField",
    component: TextField,
} as Meta;

const Template: Story<TextFieldProps> = (args) => <TextField {...args} />;

export const Primary = Template.bind({});
Primary.args = { placeholder: "Exmaple" };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true, placeholder: "Exmaple" };

export const Error = Template.bind({});
Error.args = { error: true, placeholder: "Exmaple" };
