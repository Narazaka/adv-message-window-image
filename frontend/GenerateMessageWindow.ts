import * as Jimp from "jimp";
import { Font } from "@jimp/plugin-print";
import { Configuration } from "./Configuration";

export interface FontInformations {
    [name: string]: {
        font: Font;
        height: number;
    };
}

// eslint-disable-next-line import/prefer-default-export
export class GenerateMessageWindow {
    config: Configuration;

    bases!: Jimp[];

    fontInformations!: FontInformations;

    loaded = false;

    constructor(config: Configuration) {
        this.config = config;
    }

    private static genNotifyCount(allCount: number, onProgress?: (loadedCount: number, allCount: number) => any) {
        let loadedCount = 0;
        return function notifyProgress() {
            loadedCount++;
            if (onProgress) onProgress(loadedCount, allCount);
        };
    }

    async load(onProgress?: (loadedCount: number, allCount: number) => any) {
        if (this.loaded) return;
        const notifyProgress = GenerateMessageWindow.genNotifyCount(
            this.config.baseImages.length + Object.keys(this.config.fonts).length,
            onProgress,
        );
        await Promise.all([this.loadBase(notifyProgress), this.loadFont(notifyProgress)]);
        this.loaded = true;
    }

    private async loadBase(onProgress?: (loadedCount: number, allCount: number) => any) {
        const notifyProgress = GenerateMessageWindow.genNotifyCount(this.config.baseImages.length, onProgress);
        this.bases = await Promise.all(
            this.config.baseImages.map(baseImage =>
                Jimp.read(baseImage.path).then(base => {
                    notifyProgress();
                    return base;
                }),
            ),
        );
    }

    private async loadFont(onProgress?: (loadedCount: number, allCount: number) => any) {
        const fontNames = Object.keys(this.config.fonts);
        const notifyProgress = GenerateMessageWindow.genNotifyCount(fontNames.length, onProgress);
        this.fontInformations = (
            await Promise.all(
                fontNames.map(async fontName => {
                    const font = await Jimp.loadFont(this.config.fonts[fontName]);
                    notifyProgress();
                    return [fontName, font] as const;
                }),
            )
        ).reduce(
            (fonts, [fontName, font]) => ({
                ...fonts,
                [fontName]: { font, height: Jimp.measureTextHeight(font, "田", 100) },
            }),
            {} as FontInformations,
        );
    }

    cloneBase(index: number) {
        return this.bases[index].clone();
    }

    generate(baseImageIndex: number, values: string[]) {
        const fontIndex = 0;
        const canvas = this.cloneBase(baseImageIndex);
        for (let j = 0; j < this.config.values.length; ++j) {
            const valueConfig = this.config.baseImages[baseImageIndex].values[j];
            const value = values[j];
            // eslint-disable-next-line no-continue
            if (!value) continue;
            const fontName = valueConfig.fonts[fontIndex];
            const fontInformation = this.fontInformations[fontName];
            let x = 0;
            let y = 0;
            for (let i = 0; i < value.length; ++i) {
                const char = value[i];
                if (char === "\n") {
                    x = 0;
                    y += fontInformation.height;
                    // eslint-disable-next-line no-continue
                    continue;
                }
                const width = Jimp.measureText(fontInformation.font, char);
                if (x + width > valueConfig.maxWidth) {
                    x = 0;
                    y += fontInformation.height;
                }
                canvas.print(fontInformation.font, valueConfig.origin.x + x, valueConfig.origin.y + y, char);
                x += width;
            }
        }
        return canvas;
    }
}
