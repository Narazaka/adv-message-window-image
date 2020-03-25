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
    fonts: {
        vlPGothic32: "./vl_pgothic_white/vl_pgothic.fnt",
        vl_pgothic_farewell_school_title: "./vl_pgothic_farewell_school_title/vl_pgothic.fnt",
        vl_pgothic_farewell_school_body: "./vl_pgothic_farewell_school_body/vl_pgothic.fnt",
    },
    baseImages: [
        {
            path: "./message-window.png",
            name: "シンプル赤",
            values: [
                {
                    origin: {
                        x: 40,
                        y: 10,
                    },
                    maxWidth: 940,
                    fonts: ["vlPGothic32"],
                },
                {
                    origin: {
                        x: 40,
                        y: 70,
                    },
                    maxWidth: 940,
                    fonts: ["vlPGothic32"],
                },
            ],
        },
        {
            path: "./messageframe_020_04.png",
            name: "Farewell school",
            values: [
                {
                    origin: {
                        x: 35,
                        y: 23,
                    },
                    maxWidth: 880,
                    fonts: ["vl_pgothic_farewell_school_title"],
                },
                {
                    origin: {
                        x: 65,
                        y: 80,
                    },
                    maxWidth: 820,
                    fonts: ["vl_pgothic_farewell_school_body"],
                },
            ],
        },
    ],
    imageCount: 40,
};
