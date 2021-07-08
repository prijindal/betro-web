import React from "react";
import { useMarked } from "../../hooks/marked";

const MarkedText: React.FunctionComponent<{ text: string }> = ({ text }) => {
    const markedTextContent = useMarked(text);

    return (
        <div className="text-gray-900" dangerouslySetInnerHTML={{ __html: markedTextContent }} />
    );
};

export default MarkedText;
