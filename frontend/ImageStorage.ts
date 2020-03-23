import * as firebase from "firebase/app";
import { config } from "./config";

export function imageName(index: number) {
    return `${config.name}-${index}.png`;
}

export function imageRef(index: number) {
    return firebase.storage().ref(imageName(index));
}

export async function getImageUrls() {
    return Promise.all(
        Array.from({ length: config.imageCount }, (_, i) =>
            imageRef(i)
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

function messagesCollection() {
    return firebase.firestore().collection(config.name);
}

export type MessageSnapshot = firebase.firestore.QueryDocumentSnapshot<StoredMessage>;

export async function getAllMessages() {
    const result = await messagesCollection()
        .orderBy("timestamp", "desc")
        .get();
    return (result.docs as MessageSnapshot[]).map<Message>(doc => {
        const data = doc.data();
        const values = [];
        for (let i = 0; i < config.values.length; ++i) {
            values[i] = data.values[i];
        }
        return {
            ...data,
            id: doc.id,
            values,
        };
    });
}

async function sha256(data: string) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
    return Buffer.from(hashBuffer).toString("hex");
}

export async function saveImage({ index, file, values }: { index: number; file: Buffer; values: string[] }) {
    await imageRef(index).put(file);
    const { uid } = firebase.auth().currentUser!;
    const id = await sha256(`${values.join("\t")}\t${uid}`);
    await messagesCollection()
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

export async function deleteMessage(id: string) {
    await messagesCollection()
        .doc(id)
        .delete();
}
