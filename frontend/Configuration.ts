export interface Configuration {
    name: string;
    values: ValueConfig[];
    baseImages: BaseImageConfig[];
    imageCount: number;
}

export interface ValueConfig {
    type: "text" | "textarea";
    label: string;
}

export interface BaseImageConfig {
    path: string;
    values: ValuePositionConfig[];
}

export interface ValuePositionConfig {
    origin: {
        x: number;
        y: number;
    };
    maxWidth: number;
}
