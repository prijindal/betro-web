import { useState, useEffect } from "react";
import sanitizeHTML from "sanitize-html";
import { marked } from "marked";

interface UseMarkedOptions {
    skipSanitize: boolean;
    markedOptions: marked.MarkedOptions;
    sanitizeOptions: sanitizeHTML.IOptions;
}

// Override function
const renderer: marked.RendererObject = {
    heading(text: string, level: number) {
        const headingClassMappings: { [k: string]: string } = {
            1: "prose-2xl font-medium",
            2: "prose-xl font-medium",
            3: "prose-lg font-medium",
            4: "prose font-medium",
            5: "prose-sm font-medium",
            6: "prose-sm font-normal",
        };
        return `
              <h${level} class="${headingClassMappings[level]}">
                ${text}
              </h${level}>`;
    },
    list(text: string, ordered: boolean, start: number) {
        const el = ordered ? "ol" : "ul";
        const classes = ordered ? "list-decimal ml-4" : "list-disc ml-4";
        return `
            <${el} class="${classes}">${text}</${el}>
        `;
    },
};

const defaultOptions: UseMarkedOptions = {
    skipSanitize: false,
    markedOptions: {
        gfm: true,
    },
    sanitizeOptions: {
        allowedClasses: {
            "*": ["*"],
        },
    },
};

marked.use({ renderer });

export const useMarked = (markdown: string, options: UseMarkedOptions = defaultOptions) => {
    const [html, setHtml] = useState(markdown);

    useEffect(() => {
        if (options.markedOptions) {
            marked.setOptions(options.markedOptions);
        }
        const tokens = marked.lexer(markdown);
        const html = marked.parser(tokens);
        setHtml(options.skipSanitize ? html : sanitizeHTML(html, options.sanitizeOptions));
    }, [markdown, options]);

    return html;
};
