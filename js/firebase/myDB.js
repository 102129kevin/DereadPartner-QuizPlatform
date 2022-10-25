let firebaseConfig = require("./config");
let firebase = require("firebase/app");
let firestore = require("firebase/firestore");

//創立database
const firebaseApp = firebase.initializeApp(firebaseConfig);
const myDatabase = firestore.getFirestore(firebaseApp);

//輸出db與firestroe
module.exports.myDatabase = myDatabase;
module.exports.firestore = firestore;