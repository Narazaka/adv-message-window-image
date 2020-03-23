import { Configuration } from "./Configuration";

export const config: Configuration = {
    name: "adv-message-window-image",
    values: [
        {
            type: "text",
            label: "名前",
        },
        {
            type: "textarea",
            label: "内容",
        },
    ],
    baseImages: [
        {
            path: "./message-window.png",
            values: [
                {
                    origin: {
                        x: 40,
                        y: 10,
                    },
                    maxWidth: 940,
                },
                {
                    origin: {
                        x: 40,
                        y: 70,
                    },
                    maxWidth: 940,
                },
            ],
        },
    ],
    imageCount: 40,
};
