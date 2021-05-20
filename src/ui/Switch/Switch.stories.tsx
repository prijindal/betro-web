import React from "react";
import { Story, Meta } from "@storybook/react";
import "../../index.scss";

import Switch, { SwitchProps } from "./";

export default {
    title: "UI/Switch",
    component: Switch,
} as Meta;

const Template: Story<SwitchProps> = (args) => <Switch {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    label: "Default",
    onChange: (value) => {
        console.log(value);
    },
};

export const RightLabel = Template.bind({});
RightLabel.args = {
    label: "When somebody sends you a follow request",
    disabled: true,
    labelPosition: "right",
};
