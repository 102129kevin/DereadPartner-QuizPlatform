let myDB = require("../firebase/myDB");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

function isKeyExist(obj, key) {
    return key in obj;
}

function makeClassData(classRecord) {
    let result = {};
    for (key in classRecord) {
        result[key] = classRecord[key];
    }
    return result;
}

module.exports = class TeacherModel {
    // 取得老師整個資料
    // 回傳
    // 名字、班級...
    // 統一由這個方法取得整包資料
    // 有什麼做什麼
    // 回傳給controller後render
    getTeacherData(req) {
        let docRef = firestore.doc(firebaseDB, "teachers", req.session.name);
        return new Promise(function (resolve, reject) {
            firestore.getDoc(docRef).then((snapshot) => {
                let trData = snapshot.data();
                if (!isKeyExist(trData, "cIDList")) {
                    trData["cIDList"] = undefined;
                }
                resolve(trData);
            }).catch((err) => {
                console.log("(teacherModel)not found this teacher..");
                reject(err);
            })
        })
    }

    getClassCMember(list) {
        let colRef = firestore.collection(firebaseDB, "classes");
        let q = firestore.where("cID", "in", list);
        let classInfo = {};
        return new Promise(function (resolve, reject) {
            firestore.getDocs(firestore.query(colRef, q)).then((snapshot) => {
                snapshot.forEach((doc) => {
                    let data = doc.data();
                    classInfo[doc.id] = makeClassData(data);
                })
                resolve(classInfo);
            }).catch((err) => {
                console.log("(teacherModel)not found this teacher..");
                reject(err);
            })
        })
    }
};