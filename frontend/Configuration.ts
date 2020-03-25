export interface Configuration {
    name: string;
    values: ValueConfig[];
    baseImages: BaseImageConfig[];
    imageCount: number;
    fonts: { [name: string]: string };
}

export interface ValueConfig {
    type: "text" | "textarea";
    label: string;
}

export interface BaseImageConfig {
    path: string;
    name: string;
    values: ValuePositionConfig[];
}

export interface ValuePositionConfig {
    origin: {
        x: number;
        y: number;
    };
    maxWidth: number;
    fonts: string[];
}
