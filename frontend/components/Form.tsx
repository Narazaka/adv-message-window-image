import * as React from "react";
import * as Jimp from "jimp";
import { GenerateMessageWindow } from "../GenerateMessageWindow";
import { saveImage } from "../ImageStorage";

const imageStyle: React.CSSProperties = {
    maxWidth: "100%",
};

const gen = new GenerateMessageWindow();

export interface FormProps {
    index: number;
    onSaved: () => any;
}

export const Form: React.FC<FormProps> = function Form({ index, onSaved }) {
    const [loaded, setLoaded] = React.useState(false);
    const [name, setName] = React.useState("");
    const [body, setBody] = React.useState("");
    const [image, setImage] = React.useState<Jimp | undefined>();
    const [imageUrl, setImageUrl] = React.useState<string | undefined>();
    const [trySave, setTrySave] = React.useState(false);
    React.useEffect(() => {
        gen.load().then(() => setLoaded(true));
    }, []);
    React.useEffect(() => {
        if (gen.loaded) setImage(gen.generate(name, body));
    }, [name, body]);
    React.useEffect(() => {
        if (image) {
            image.getBase64Async("image/png").then(img => setImageUrl(img));
        } else {
            setImageUrl(undefined);
        }
    }, [image]);
    React.useEffect(() => {
        if (trySave && image) {
            image
                .getBufferAsync("image/png")
                .then(buffer => saveImage(index, buffer))
                .then(() => {
                    setTrySave(false);
                    onSaved();
                });
        }
    }, [trySave]);

    if (!loaded) return <div>LOADING...</div>;

    return (
        <div>
            <div>
                名前: <input value={name} onInput={event => setName(event.currentTarget.value)} />
                <br />
                内容: <textarea onInput={event => setBody(event.currentTarget.value)}>{body}</textarea>
            </div>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            {imageUrl && <img src={imageUrl} style={imageStyle} />}
            <button type="button" disabled={!imageUrl || trySave} onClick={() => setTrySave(true)}>
                保存
            </button>
        </div>
    );
};
