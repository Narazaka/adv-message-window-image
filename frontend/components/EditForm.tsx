import * as React from "react";
import { Form } from "semantic-ui-react";
import { config } from "../config";

export interface EditFormProps {
    values: string[];
    setValue: (index: number, value: string) => any;
    baseImageIndex: number;
    setBaseImageIndex: (value: number) => any;
}

export const EditForm: React.FC<EditFormProps> = function EditForm({
    values,
    setValue,
    baseImageIndex,
    setBaseImageIndex,
}) {
    return (
        <>
            <Form>
                {config.values.map(({ type, label }, index) => {
                    switch (type) {
                        case "text":
                            return (
                                <Form.Input
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    label={label}
                                    value={values[index]}
                                    onChange={(_, { value }) => setValue(index, value)}
                                />
                            );
                        case "textarea":
                            return (
                                <Form.TextArea
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    label={label}
                                    value={values[index]}
                                    onChange={(_, { value }) => setValue(index, value as string)}
                                />
                            );
                        default:
                            throw new Error("unknown type");
                    }
                })}
                <Form.Group inline>
                    {config.baseImages.map((baseImage, imageIndex) => (
                        <Form.Radio
                            // eslint-disable-next-line react/no-array-index-key
                            key={imageIndex}
                            label={baseImage.name}
                            value={imageIndex}
                            checked={imageIndex === baseImageIndex}
                            // eslint-disable-next-line no-shadow
                            onChange={(_, { value }) => setBaseImageIndex(Number(value))}
                        />
                    ))}
                </Form.Group>
            </Form>
        </>
    );
};
