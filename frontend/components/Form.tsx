import * as React from "react";
import * as Jimp from "jimp";
import { GenerateMessageWindow } from "../GenerateMessageWindow";
import { saveImage } from "../ImageStorage";

const imageStyle: React.CSSProperties = {
    maxWidth: "100%",
};

const saveStyle: React.CSSProperties = {
    color: "#ffffff",
    background: "#ff0000",
    border: "none",
};

const applyStyle: React.CSSProperties = {
    color: "#ffffff",
    background: "#00cccc",
    border: "none",
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
    const [apply, setApply] = React.useState(false);
    React.useEffect(() => {
        gen.load().then(() => setLoaded(true));
    }, []);
    /* React.useEffect(() => {
        if (gen.loaded) setImage(gen.generate(name, body));
    }, [name, body]); */
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
    React.useEffect(() => {
        if (apply) {
            if (gen.loaded) {
                setImage(gen.generate(name, body));
                setApply(false);
            }
        }
    }, [apply]);

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
            <br />
            <button type="button" style={applyStyle} disabled={apply} onClick={() => setApply(true)}>
                テキストから画像を生成
            </button>
            <br />
            <button type="button" style={saveStyle} disabled={!imageUrl || trySave} onClick={() => setTrySave(true)}>
                {index + 1}番目に上書き保存
            </button>
        </div>
    );
};
