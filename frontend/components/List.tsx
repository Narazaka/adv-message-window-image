import * as React from "react";
import { getImageUrls } from "../ImageStorage";

const container: React.CSSProperties = {
    display: "block",
    margin: "1em",
};

const imageStyle: React.CSSProperties = {
    border: "2px solid #ccccff",
    width: "300px",
    height: "75px",
    margin: "2px",
};

const selectedImage: React.CSSProperties = {
    ...imageStyle,
    border: "2px solid #00bbff",
};

export interface ListProps {
    index: number;
    setIndex: (value: number) => any;
    saved: boolean;
    resetSaved: () => any;
}

export const List: React.FC<ListProps> = function List({ index, setIndex, saved, resetSaved }) {
    const [imageUrls, setImageUrls] = React.useState<string[]>([]);
    React.useEffect(() => {
        if (saved) {
            resetSaved();
            getImageUrls().then(urls => setImageUrls(urls));
        }
    }, [saved]);

    return (
        <div style={container}>
            {imageUrls.map((imageUrl, i) => (
                // eslint-disable-next-line jsx-a11y/alt-text, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <img
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    src={imageUrl}
                    style={i === index ? selectedImage : imageStyle}
                    onClick={() => setIndex(i)}
                />
            ))}
            <pre>{imageUrls.join("\n")}</pre>
        </div>
    );
};
