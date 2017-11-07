import firebase from "firebase";
const config = {
  apiKey: "AIzaSyAPNiKJhf7aqNTUNsdxIz-BvmmB8XsLuzI",
  authDomain: "beerbot-91a90.firebaseapp.com",
  databaseURL: "https://beerbot-91a90.firebaseio.com",
  projectId: "beerbot-91a90",
  storageBucket: "beerbot-91a90.appspot.com",
  messagingSenderId: "995330126089"
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
