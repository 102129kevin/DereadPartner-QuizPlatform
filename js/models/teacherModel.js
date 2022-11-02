let myDB = require("../firebase/myDB");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

function isKeyExist(obj, key) {
    return key in obj;
}

function isFieldUndefined(obj, field) {
    return (obj[field] == undefined)
}

function makeClassData(classRecord) {
    let result = {};
    for (key in classRecord) {
        result[key] = classRecord[key];
    }
    return result;
}

module.exports = class TeacherModel {

    getTeacherData(req) {
        let docRef = firestore.doc(firebaseDB, "teachers", req.session.name);

        return new Promise(function (resolve, reject) {
            firestore.getDoc(docRef).then((snapshot) => {
                let trData = snapshot.data();
                resolve(trData);
            }).catch((err) => {
                console.log("(teacherModel)not found this teacher..");
                reject(err);
            })
        })
    }

    // 欠改 應該可合併至classModel
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

    preprocessTeacherData(trData) {
        if (!isKeyExist(trData, "cIDList")) {
            trData["cIDList"] = undefined;
        }

        return trData;
    }

    addcIdList(req, cId, trData) {
        let docRef = firestore.doc(firebaseDB, "teachers", req.session.name);

        // 判斷cIDList欄位經過preprocessTeacherData處理後是否為undefined
        if (!isFieldUndefined(trData, "cIDList")) {
            trData["cIDList"].push(cId);
        }
        else {
            trData["cIDList"] = [];
            trData["cIDList"].push(cId);
        }

        return new Promise(function (resolve, reject) {
            firestore.setDoc(docRef, trData, { merge: true })
                .then(() => {
                    console.log("done in teacherModel");
                    resolve("done");
                })
                .catch((err) => {
                    console.log("(teacherModel) addcIdList Failed");
                    reject(err);
                })
        })

    }
};