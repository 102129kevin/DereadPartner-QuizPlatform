let myDB = require("../firebase/myDB");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

module.exports = class RegisterModel {
    async setRegisterRequest(req, res, next) {

        // do something 回傳結果

        // 寫入資料庫
        let docRef = firestore.doc(firebaseDB, "students", req.body["regID"]);
        let data = {
            sID: req.body["regID"],
            name: req.body["regName"],
            password: req.body["regPasswd"]
        }

        // 回傳寫入成功
        await firestore.setDoc(docRef, data).then(function () {
            console.log("RegisterModel.setRegisterRequest : done!");
        });
    }

    // 抓資料
    // 註冊資料查詢對應班級ID(MODEL) > 有(Controller) > 抓回該班級member(Model) > 無 > 您不是這個班級成員喔
    // 使用該班級ID確認是否有此人
    getClassID(className) {
        let classCol = firestore.collection(firebaseDB, "classes");
        let query = firestore.query(classCol, firestore.where("cName", "==", className));
        return new Promise(function (resolve, reject) {
            firestore.getDocs(query).then(function (snapshot) {
                snapshot.forEach((doc) => {
                    let data = doc.data();
                    let cID = data["cID"];
                    resolve(cID);
                })
            }).catch(function (err) {
                reject(err);
            });
        })
    }

    getClassMember(classID) {
        let docRef = firestore.doc(firebaseDB, "classes", classID);
        return new Promise(function (resolve, reject) {
            firestore.getDoc(docRef).then(function (snapshot) {
                let data = snapshot.data();
                let classID = data["cMember"];
                resolve(classID);
            }).catch(function (err) {
                reject(err);
            });
        })
    }

}