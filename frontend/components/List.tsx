import * as React from "react";
import { getImageUrls } from "../ImageStorage";

const container: React.CSSProperties = {
    display: "block",
    margin: "1em",
};

const imageStyle: React.CSSProperties = {
    border: "4px solid #ffffff",
    width: "300px",
    height: "75px",
    margin: "2px",
};

const selectedImage: React.CSSProperties = {
    ...imageStyle,
    border: "4px solid #00bbff",
};

export interface ListProps {
    index: number;
    setIndex: (value: number) => any;
    saved: boolean;
    resetSaved: () => any;
}

export const List: React.FC<ListProps> = function List({ index, setIndex, saved, resetSaved }) {
    const [imageUrls, setImageUrls] = React.useState<string[]>([]);
    const keyOffset = React.useRef(new Date().getTime());
    React.useEffect(() => {
        if (saved) {
            resetSaved();
            getImageUrls().then(urls => {
                keyOffset.current = new Date().getTime();
                setImageUrls(urls);
            });
        }
    }, [saved]);

    return (
        <div style={container}>
            {imageUrls.map((imageUrl, i) => (
                // eslint-disable-next-line jsx-a11y/alt-text, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                <img
                    // eslint-disable-next-line react/no-array-index-key
                    key={keyOffset.current + i}
                    src={imageUrl}
                    style={i === index ? selectedImage : imageStyle}
                    onClick={() => setIndex(i)}
                />
            ))}
            <pre>{imageUrls.join("\n")}</pre>
        </div>
    );
};
