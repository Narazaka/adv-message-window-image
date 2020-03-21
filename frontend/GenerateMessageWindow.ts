import * as Jimp from "jimp";
import { Font } from "@jimp/plugin-print";

// eslint-disable-next-line import/prefer-default-export
export class GenerateMessageWindow {
    static baseX = 40;

    static nameY = 10;

    static bodyY = 70;

    static maxWidth = 940;

    base!: Jimp;

    font!: Font;

    fontHeight!: number;

    loaded = false;

    async load() {
        await this.loadBase();
        await this.loadFont();
        this.loaded = true;
    }

    private async loadBase() {
        this.base = await Jimp.read("./message-window.png");
    }

    private async loadFont() {
        this.font = await Jimp.loadFont("./vl_pgothic_white/vl_pgothic.fnt");
        this.fontHeight = Jimp.measureTextHeight(this.font, "田", 100);
    }

    cloneBase() {
        return this.base.clone();
    }

    generate(name: string, body: string) {
        const canvas = this.cloneBase();
        canvas.print(this.font, GenerateMessageWindow.baseX, GenerateMessageWindow.nameY, name);
        let x = 0;
        let y = 0;
        for (let i = 0; i < body.length; ++i) {
            const char = body[i];
            if (char === "\n") {
                x = 0;
                y += this.fontHeight;
                // eslint-disable-next-line no-continue
                continue;
            }
            const width = Jimp.measureText(this.font, char);
            if (x + width > GenerateMessageWindow.maxWidth) {
                x = 0;
                y += this.fontHeight;
            }
            canvas.print(this.font, GenerateMessageWindow.baseX + x, GenerateMessageWindow.bodyY + y, char);
            x += width;
        }
        return canvas;
    }
}
