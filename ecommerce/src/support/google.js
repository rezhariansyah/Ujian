import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBC4WsSin8wSWh9qFkBPkXR4_vKpQ8oCPw",
    authDomain: "react-ecommers.firebaseapp.com",
    databaseURL: "https://react-ecommers.firebaseio.com",
    projectId: "react-ecommers",
    storageBucket: "",
    messagingSenderId: "142272569390"
};

firebase.initializeApp(config)
export const ref = firebase.database().ref();
export const auth = firebase.auth;
export const provider = new firebase.auth.GoogleAuthProvider();