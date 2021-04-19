import React from "react";
import Features from "../../components/Features";
import { wrapLayout } from "../../components/Layout";

const App = () => {
    return (
        <React.Fragment>
            <Features />
        </React.Fragment>
    );
};

export default wrapLayout(App);
