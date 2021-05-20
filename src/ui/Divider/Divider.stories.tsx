import React from "react";
import { Story, Meta } from "@storybook/react";
import "../../index.scss";

import Divider, { DividerProps } from "./";

export default {
    title: "UI/Divider",
    component: Divider,
} as Meta;

const Template: Story<DividerProps> = (args) => <Divider {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

export const Secondary = Template.bind({});
Secondary.args = { className: "border-gray-500" };
