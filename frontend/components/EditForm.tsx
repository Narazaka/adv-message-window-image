import * as React from "react";
import { Form } from "semantic-ui-react";
import { config } from "../config";

export interface EditFormProps {
    values: string[];
    setValue: (index: number, value: string) => any;
}

export const EditForm: React.FC<EditFormProps> = function EditForm({ values, setValue }) {
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
            </Form>
        </>
    );
};
