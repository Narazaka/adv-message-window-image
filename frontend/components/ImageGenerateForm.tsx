import * as React from "react";
import * as Jimp from "jimp";
import { useDebounce } from "use-debounce";
import { Button, Loader, Form, Image, Segment, Dimmer, Progress } from "semantic-ui-react";
import { GenerateMessageWindow } from "../GenerateMessageWindow";
import { ImageStorage } from "../ImageStorage";
import { config } from "../config";

const gen = new GenerateMessageWindow(config);

export interface ImageGenerateFormProps {
    values: string[];
    imageBaseIndex: number;
    index: number;
    onSaved: () => any;
    imageStorage: ImageStorage;
}

export const ImageGenerateForm: React.FC<ImageGenerateFormProps> = function ImageGenerateForm({
    values: valuesInput,
    imageBaseIndex,
    index,
    onSaved,
    imageStorage,
}) {
    const [loaded, setLoaded] = React.useState(gen.loaded);
    const [values] = useDebounce(valuesInput, 400);
    const [loadCounts, setLoadCounts] = React.useState<[number, number]>([0, 0]);
    const [image, setImage] = React.useState<Jimp | undefined>();
    const [imageUrl, setImageUrl] = React.useState<string | undefined>();
    const [trySave, setTrySave] = React.useState(false);
    React.useEffect(() => {
        if (!loaded)
            gen.load((loadedCount, allCount) => setLoadCounts([loadedCount, allCount])).then(() => setLoaded(true));
    }, []);
    React.useEffect(() => {
        if (loaded) setImage(gen.generate(imageBaseIndex, values));
    }, [imageBaseIndex, values, loaded]);
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
                .then(file => imageStorage.saveImage({ index, file, values }))
                .then(() => {
                    setTrySave(false);
                    onSaved();
                });
        }
    }, [trySave]);

    if (!loaded)
        return (
            <Progress value={loadCounts[0]} total={loadCounts[1]} progress="ratio" indicating>
                Loading
            </Progress>
        );

    return (
        <Dimmer.Dimmable as={Segment}>
            <Dimmer active={!loaded} inverted>
                <Loader>Loading</Loader>
            </Dimmer>
            <Form>
                <Form.Group inline>
                    <Button
                        primary
                        type="button"
                        disabled={!imageUrl || trySave || values.every(value => !value)}
                        onClick={() => setTrySave(true)}
                    >
                        {index + 1}番目に上書き保存
                    </Button>
                </Form.Group>
                {imageUrl && <Image fluid src={imageUrl} />}
            </Form>
        </Dimmer.Dimmable>
    );
};
