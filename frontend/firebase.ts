import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);
