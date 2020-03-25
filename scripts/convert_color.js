const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const inDir = process.argv[2];
const outDir = process.argv[3];
const fontFile = process.argv[4];
const [red, green, blue] = process.argv.slice(5).map(Number);

Promise.all(
    fs
        .readdirSync(inDir)
        .filter(file => file.endsWith(".png"))
        .map(async file => {
            const inFile = path.join(inDir, file);
            const outFile = path.join(outDir, file);
            const image = await Jimp.read(inFile);
            image.color([
                { apply: "red", params: [-256] },
                { apply: "green", params: [-256] },
                { apply: "blue", params: [-256] },
                { apply: "red", params: [red] },
                { apply: "green", params: [green] },
                { apply: "blue", params: [blue] },
            ]);
            await image.writeAsync(outFile);
        }),
).then(() => {
    fs.writeFileSync(path.join(outDir, fontFile), fs.readFileSync(path.join(inDir, fontFile)));
});
