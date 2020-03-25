import * as firebase from "firebase/app";
import { Configuration } from "./Configuration";

export interface StoredMessage {
    values: { [index: string]: string };
    timestamp: firebase.firestore.Timestamp;
    baseImageIndex?: number;
    uid: string;
}

export interface Message {
    id: string;
    values: string[];
    baseImageIndex: number;
    timestamp: firebase.firestore.Timestamp;
    uid: string;
}

export type MessageSnapshot = firebase.firestore.QueryDocumentSnapshot<StoredMessage>;

export interface ImagesInfo {
    [id: string]: ImageInfo;
}

export interface StoredImageInfo {
    values: { [index: string]: string };
    t: firebase.firestore.Timestamp;
}

export interface ImageInfo {
    values: string[];
    t: number;
}

export type ImageSnapshot = firebase.firestore.QueryDocumentSnapshot<StoredImageInfo>;

async function sha256(data: string) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
    return Buffer.from(hashBuffer).toString("hex");
}

function arrayToHash(values: string[]) {
    return values.reduce(
        (valuesHash, value, i) => ({ ...valuesHash, [i]: value || "" }),
        {} as { [index: string]: string },
    );
}

function hashToArray(data: { [index: string]: string }, count: number) {
    const values = [];
    for (let i = 0; i < count; ++i) {
        values[i] = data[i];
    }
    return values;
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

    private convertImageInfo(doc: ImageSnapshot) {
        const data = doc.data();
        return {
            t: data.t.seconds,
            values: hashToArray(data.values || {}, this.config.values.length),
        };
    }

    listenImages(listener: (current: ImagesInfo, diffs: ImagesInfo) => any) {
        return this.imagesCollection().onSnapshot(snapshot => {
            const current = (snapshot.docs as ImageSnapshot[]).reduce(
                (docs, doc) => ({
                    ...docs,
                    [doc.id]: this.convertImageInfo(doc),
                }),
                {} as ImagesInfo,
            );
            const diffs = snapshot
                .docChanges()
                .filter(diff => diff.type === "modified")
                .reduce(
                    (docs, diff) => ({
                        ...docs,
                        [diff.doc.id]: this.convertImageInfo(diff.doc as ImageSnapshot),
                    }),
                    {} as ImagesInfo,
                );
            listener(current, diffs);
        });
    }

    private imagesCollection() {
        return firebase.firestore().collection(`${this.config.name}-image`);
    }

    private messagesCollection() {
        return firebase.firestore().collection(this.config.name);
    }

    listenAllMessages(listener: (messages: Message[]) => any) {
        return this.messagesCollection()
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const result = (snapshot.docs as MessageSnapshot[]).map<Message>(doc => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id,
                        values: hashToArray(data.values, this.config.values.length),
                        baseImageIndex: data.baseImageIndex || 0,
                    };
                });
                listener(result);
            });
    }

    async saveImage({
        index,
        file,
        values,
        baseImageIndex,
    }: {
        index: number;
        file: Buffer;
        values: string[];
        baseImageIndex: number;
    }) {
        await this.imageRef(index).put(file);
        await this.imagesCollection()
            .doc(`${index}`)
            .set({ t: firebase.firestore.FieldValue.serverTimestamp(), values: arrayToHash(values) });
        const { uid } = firebase.auth().currentUser!;
        const id = await sha256(`${values.join("\t")}\t${uid}`);
        await this.messagesCollection()
            .doc(id)
            .set({
                values: arrayToHash(values),
                baseImageIndex,
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
