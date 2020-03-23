import * as firebase from "firebase/app";
import { Configuration } from "./Configuration";

export interface StoredMessage {
    values: { [index: string]: string };
    timestamp: Date;
    uid: string;
}

export interface Message {
    id: string;
    values: string[];
    timestamp: Date;
    uid: string;
}

export type MessageSnapshot = firebase.firestore.QueryDocumentSnapshot<StoredMessage>;

async function sha256(data: string) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
    return Buffer.from(hashBuffer).toString("hex");
}

export class ImageStorage {
    config: Configuration;

    constructor(config: Configuration) {
        this.config = config;
    }

    private imageName(index: number) {
        return `${this.config.name}-${index}.png`;
    }

    private imageRef(index: number) {
        return firebase.storage().ref(this.imageName(index));
    }

    async getImageUrls() {
        return Promise.all(
            Array.from({ length: this.config.imageCount }, (_, i) =>
                this.imageRef(i)
                    .getDownloadURL()
                    .then(
                        url => {
                            const urlp = new URL(url);
                            urlp.searchParams.delete("token");
                            return urlp.toString();
                        },
                        error => {
                            // eslint-disable-next-line no-console
                            console.error(error);
                            return "";
                        },
                    ),
            ),
        );
    }

    private messagesCollection() {
        return firebase.firestore().collection(this.config.name);
    }

    async getAllMessages() {
        const result = await this.messagesCollection()
            .orderBy("timestamp", "desc")
            .get();
        return (result.docs as MessageSnapshot[]).map<Message>(doc => {
            const data = doc.data();
            const values = [];
            for (let i = 0; i < this.config.values.length; ++i) {
                values[i] = data.values[i];
            }
            return {
                ...data,
                id: doc.id,
                values,
            };
        });
    }

    async saveImage({ index, file, values }: { index: number; file: Buffer; values: string[] }) {
        await this.imageRef(index).put(file);
        const { uid } = firebase.auth().currentUser!;
        const id = await sha256(`${values.join("\t")}\t${uid}`);
        await this.messagesCollection()
            .doc(id)
            .set({
                values: values.reduce(
                    (valuesHash, value, i) => ({ ...valuesHash, [i]: value || "" }),
                    {} as { [index: string]: string },
                ),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
            });
    }

    async deleteMessage(id: string) {
        await this.messagesCollection()
            .doc(id)
            .delete();
    }
}
