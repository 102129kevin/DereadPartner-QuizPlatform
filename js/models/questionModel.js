let myDB = require("../firebase/myDB");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

function makeQuestionObject(recordID, recordData) {
    let obj = {
        qId: recordID,
        topic: recordData["topic"],
        options: recordData["options"],
        unit: recordData["unit"]
    }

    return obj;
}

module.exports = class QuestionModel {

    getAllQuestionData() {
        let colRef = firestore.collection(firebaseDB, "question");
        return new Promise((resolve, reject) => {
            firestore.getDocs(colRef)
                .then((snapshot) => {
                    let qList = [];
                    snapshot.forEach((doc) => {
                        qList.push(makeQuestionObject(doc.id, doc.data()));
                    });
                    resolve(qList);
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    }

    getQuestionDataByUnit(unit) {
        let colRef = firestore.collection(firebaseDB, "question");
        let q = firestore.where("unit", "==", unit);
        return new Promise((resolve, reject) => {
            firestore.getDocs(firestore.query(colRef, q))
                .then((snapshot) => {
                    let qList = [];
                    snapshot.forEach((doc) => {
                        qList.push(makeQuestionObject(doc.id, doc.data()));
                    });
                    resolve(qList);
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    }

    getQuestionById(id) {
        let docRef = firestore.doc(firebaseDB, "question", id);
        return new Promise((resolve, reject) => {
            firestore.getDoc(docRef)
                .then((snapshot) => {
                    let data = snapshot.data()
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    }
}