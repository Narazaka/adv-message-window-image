import * as React from "react";
import { Grid, Image } from "semantic-ui-react";
import * as iziToastAll from "izitoast";
import { ImageStorage, ImagesInfo } from "../ImageStorage";

const iziToast = (iziToastAll as any) as typeof iziToastAll.default;

const imageStyle: React.CSSProperties = {
    border: "5px solid #ffffff",
    margin: "2px",
    cursor: "pointer",
};

const selectedImage: React.CSSProperties = {
    ...imageStyle,
    border: "5px solid #00bbff",
};

export interface ImageListProps {
    index: number;
    setIndex: (value: number) => any;
    saved: boolean;
    imageStorage: ImageStorage;
}

export const ImageList: React.FC<ImageListProps> = function ImageList({ index, setIndex, saved, imageStorage }) {
    const [imageUrls, setImageUrls] = React.useState<string[]>([]);
    const [keyOffset, setKeyOffset] = React.useState(new Date().getTime());
    const [imagesInfo, setImagesInfo] = React.useState<ImagesInfo>({});
    React.useEffect(() => {
        imageStorage.getImageUrls().then(urls => {
            setImageUrls(urls);
        });
    }, []);
    React.useEffect(() => {
        return imageStorage.listenImages((current, diffs) => {
            setImagesInfo(current);
            // eslint-disable-next-line no-restricted-syntax
            for (const i of Object.keys(diffs)) {
                iziToast.show({
                    title: `${Number(i) + 1}番目の画像が更新されました`,
                    message: `${diffs[i].values.join("\n")}`,
                    position: "topRight",
                    timeout: 4000,
                    progressBar: false,
                    color: "yellow",
                });
            }
        });
    }, []);
    React.useEffect(() => {
        if (saved) {
            setKeyOffset(new Date().getTime());
        }
    }, [saved]);

    return (
        <Grid columns={3} doubling stackable>
            {imageUrls.map((imageUrl, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid.Column key={i}>
                    <Image
                        // eslint-disable-next-line react/no-array-index-key
                        key={(imagesInfo[i]?.t || keyOffset) + i}
                        label={{ floating: true, content: `${i + 1}`, color: i === index ? "blue" : undefined }}
                        src={`${imageUrl}&dummy=${imagesInfo[i]?.t || keyOffset}`}
                        style={i === index ? selectedImage : imageStyle}
                        onClick={() => setIndex(i)}
                    />
                </Grid.Column>
            ))}
            <pre>{imageUrls.join("\n")}</pre>
        </Grid>
    );
};
