import { Configuration } from "./Configuration";

export const config: Configuration = {
    baseImages: ["./message-window.png"],
    imageCount: 10,
    values: [
        {
            type: "text",
            label: "名前",
            origin: {
                x: 40,
                y: 10,
            },
            maxWidth: 940,
        },
        {
            type: "textarea",
            label: "内容",
            origin: {
                x: 40,
                y: 70,
            },
            maxWidth: 940,
        },
    ],
};
