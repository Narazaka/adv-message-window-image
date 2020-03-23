import { Configuration } from "./Configuration";

export const config: Configuration = {
    baseImages: ["./message-window.png"],
    imageCount: 40,
    imageNamePrefix: "adv-message-window-image-",
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
