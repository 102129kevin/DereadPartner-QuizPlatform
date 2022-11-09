let myDB = require("../firebase/myDB");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

module.exports = class LoginModel {

    getUserData(id, type) {
        let docRef = firestore.doc(firebaseDB, type, id);
        return new Promise(function (resolve, reject) {
            // 查詢身分資料
            firestore.getDoc(docRef).then(function (snapshot) {
                let data = snapshot.data();
                resolve(data);
            }).catch(function (err) {
                reject(err);
            });
        })
    }
}