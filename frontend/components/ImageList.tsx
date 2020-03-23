import * as React from "react";
import { Grid, Image } from "semantic-ui-react";
import { ImageStorage, ImagesInfo } from "../ImageStorage";

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
        return imageStorage.listenImages(info => setImagesInfo(info));
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
                        key={(imagesInfo[i] || keyOffset) + i}
                        label={{ floating: true, content: `${i + 1}`, color: i === index ? "blue" : undefined }}
                        src={`${imageUrl}&dummy=${imagesInfo[i] || keyOffset}`}
                        style={i === index ? selectedImage : imageStyle}
                        onClick={() => setIndex(i)}
                    />
                </Grid.Column>
            ))}
            <pre>{imageUrls.join("\n")}</pre>
        </Grid>
    );
};
