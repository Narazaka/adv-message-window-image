export interface Configuration {
    name: string;
    values: ValueConfig[];
    baseImages: string[];
    imageCount: number;
}

export interface ValueConfig {
    type: "text" | "textarea";
    label: string;
    origin: {
        x: number;
        y: number;
    };
    maxWidth: number;
}
