import * as Jimp from "jimp";
import { Font } from "@jimp/plugin-print";
import { Configuration } from "./Configuration";

// eslint-disable-next-line import/prefer-default-export
export class GenerateMessageWindow {
    config: Configuration;

    bases!: Jimp[];

    font!: Font;

    fontHeight!: number;

    loaded = false;

    constructor(config: Configuration) {
        this.config = config;
    }

    async load() {
        if (this.loaded) return;
        await this.loadBase();
        await this.loadFont();
        this.loaded = true;
    }

    private async loadBase() {
        this.bases = await Promise.all(this.config.baseImages.map(baseImage => Jimp.read(baseImage)));
    }

    private async loadFont() {
        this.font = await Jimp.loadFont("./vl_pgothic_white/vl_pgothic.fnt");
        this.fontHeight = Jimp.measureTextHeight(this.font, "田", 100);
    }

    cloneBase(index: number) {
        return this.bases[index].clone();
    }

    generate(values: string[]) {
        const canvas = this.cloneBase(0);
        for (let j = 0; j < this.config.values.length; ++j) {
            const valueConfig = this.config.values[j];
            const value = values[j];
            // eslint-disable-next-line no-continue
            if (!value) continue;
            let x = 0;
            let y = 0;
            for (let i = 0; i < value.length; ++i) {
                const char = value[i];
                if (char === "\n") {
                    x = 0;
                    y += this.fontHeight;
                    // eslint-disable-next-line no-continue
                    continue;
                }
                const width = Jimp.measureText(this.font, char);
                if (x + width > valueConfig.maxWidth) {
                    x = 0;
                    y += this.fontHeight;
                }
                canvas.print(this.font, valueConfig.origin.x + x, valueConfig.origin.y + y, char);
                x += width;
            }
        }
        return canvas;
    }
}
