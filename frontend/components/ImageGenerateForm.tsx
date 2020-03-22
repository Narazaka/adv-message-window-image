import * as React from "react";
import * as Jimp from "jimp";
import { useDebounce } from "use-debounce";
import { Button, Loader, Form, Image, Segment, Dimmer } from "semantic-ui-react";
import { GenerateMessageWindow } from "../GenerateMessageWindow";
import { saveImage } from "../ImageStorage";
import { config } from "../config";

const gen = new GenerateMessageWindow(config);

export interface ImageGenerateFormProps {
    values: string[];
    index: number;
    onSaved: () => any;
}

export const ImageGenerateForm: React.FC<ImageGenerateFormProps> = function ImageGenerateForm({
    values: valuesInput,
    index,
    onSaved,
}) {
    const [loaded, setLoaded] = React.useState(gen.loaded);
    const [values] = useDebounce(valuesInput, 400);
    const [image, setImage] = React.useState<Jimp | undefined>();
    const [imageUrl, setImageUrl] = React.useState<string | undefined>();
    const [trySave, setTrySave] = React.useState(false);
    React.useEffect(() => {
        if (!loaded) gen.load().then(() => setLoaded(true));
    }, []);
    React.useEffect(() => {
        if (loaded) setImage(gen.generate(values));
    }, [values, loaded]);
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
                .then(file => saveImage({ index, file, values }))
                .then(() => {
                    setTrySave(false);
                    onSaved();
                });
        }
    }, [trySave]);

    if (!loaded) return <Loader active inline />;

    return (
        <Dimmer.Dimmable as={Segment}>
            <Dimmer active={!loaded} inverted>
                <Loader>Loading</Loader>
            </Dimmer>
            <Form>
                <Button primary type="button" disabled={!imageUrl || trySave} onClick={() => setTrySave(true)}>
                    {index + 1}番目に上書き保存
                </Button>
                {imageUrl && <Image fluid src={imageUrl} />}
            </Form>
        </Dimmer.Dimmable>
    );
};
