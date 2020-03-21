import * as firebase from "firebase/app";

export function imageName(index: number) {
    return `adv-message-window-image-${index}.png`;
}

export function imageRef(index: number) {
    return firebase.storage().ref(imageName(index));
}

export async function getImageUrls() {
    return Promise.all(
        Array.from({ length: 10 }, (_, i) =>
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

export async function saveImage(index: number, file: Buffer) {
    return imageRef(index).put(file);
}
