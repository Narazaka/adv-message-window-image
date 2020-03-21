import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB8aQJvtlEeWd7vBh8EUU4nQJiji7WwDs0",
    authDomain: "adv-message-window-image.firebaseapp.com",
    databaseURL: "https://adv-message-window-image.firebaseio.com",
    projectId: "adv-message-window-image",
    storageBucket: "adv-message-window-image.appspot.com",
    messagingSenderId: "354320701187",
    appId: "1:354320701187:web:fe7226a0a25299bc48fb36",
    measurementId: "G-V7FFRFLSV6",
};
firebase.initializeApp(firebaseConfig);
