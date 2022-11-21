let myDB = require("../firebase/myDB");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

function makeStuData(record) {
    let data = {
        sID: record.sID,
        name: record.name,
        exRec: record.exRecIDList
    };
    return data;
}

module.exports = class StudentModel {
    // 新增班級前先檢查是否有該班級
    // 有 > 已經有此班級
    // 無 > 新增班級

    getStudentData(sID) {
        let docRef = firestore.doc(firebaseDB, "students", sID);
        return new Promise(function (resolve, reject) {
            firestore.getDoc(docRef)
                .then((snapshot) => {
                    let stuData = snapshot.data();
                    resolve(stuData);
                })
                .catch((err) => {
                    console.log("(studentModel)not found this student..");
                    reject(err);
                })
        })
    }

    getStudentsDataByTID(tID) {
        let colRef = firestore.collection(firebaseDB, "students");
        let q = firestore.where("tID", "==", tID);

        return new Promise(function (resolve, reject) {
            firestore.getDocs(firestore.query(colRef, q))
                .then((snapshot) => {
                    let stuList = [];
                    snapshot.forEach((rec) => {
                        stuList.push(makeStuData(rec.data()));
                    });
                    resolve(stuList);
                })
                .catch((err) => {
                    console.log("(studentModel)not found this student..");
                    reject(err);
                })
        })
    }

    setStudentCID(sID, addCID) {
        let docRef = firestore.doc(firebaseDB, "students", sID);
        let setData = {
            cID: addCID
        }
        return new Promise((resolve, reject) => {
            firestore.updateDoc(docRef, setData)
                .then(() => {
                    resolve("done");
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    setExRecList(sID, newExRecList) {
        let docRef = firestore.doc(firebaseDB, "students", sID);
        let setData = {
            exRecIDList: newExRecList
        }
        return new Promise((resolve, reject) => {
            firestore.updateDoc(docRef, setData)
                .then(() => {
                    resolve("done");
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }
}