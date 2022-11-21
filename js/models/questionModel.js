let myDB = require("../firebase/myDB");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

function makeQuestionObject(recordID, recordData) {
    let obj = {
        qId: recordID,
        topic: recordData["topic"],
        options: recordData["options"],
        explain: recordData["explain"],
        unit: recordData["unit"],
        img: recordData["img"]
    }

    return obj;
}

function makeQuestionDoc(req) {
    let data = req.body;
    let qDoc = {};
    qDoc["topic"] = replaceSpace(data["topic"]);
    qDoc["unit"] = parseInt(data["unit"]);
    qDoc["tID"] = req.session.name;

    let options = [];
    let correctChoice = parseInt(data["correctChoose"]);
    for (let i = 1; i <= 4; i++) {
        let option = {};
        let curIndex = "choose" + i;
        option["option"] = replaceSpace(data[curIndex]);
        if (i == correctChoice) {
            option["value"] = true;
        } else {
            option["value"] = false;
        }
        options.push(option);
    }
    qDoc["options"] = options;

    // 詳解
    if(data["explain"]){
        qDoc["explain"] = replaceSpace(data["explain"]);
    }

    return qDoc;
}

function replaceSpace(str) {
    return str.replace(/\s+/g, "");
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

    getQuestionBytID(tID) {
        let colRef = firestore.collection(firebaseDB, "question");
        let q = firestore.where("tID", "==", tID);

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

    setQuestion(req) {
        let qData = makeQuestionDoc(req);
        let colRef = firestore.collection(firebaseDB, "question");

        return new Promise((resolve, reject) => {
            firestore.addDoc(colRef, qData)
                .then((newDoc) => {
                    console.log("(questionModel)setQuestion:done");
                    resolve(newDoc.id);
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    }

    updateQuestion(req) {
        let qData = makeQuestionDoc(req);
        let qID = req.body["qID"];
        let docRef = firestore.doc(firebaseDB, "question", qID);
        
        return new Promise((resolve, reject) => {
            firestore.updateDoc(docRef, qData)
                .then(() => {
                    console.log("(questionModel)updateQuestion:done");
                    resolve(qID);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(err);
                });
        });
    }

    updateQuestionImg(qID, imgName) {
        let docRef = firestore.doc(firebaseDB, "question", qID);
        let data = {
            img: imgName
        };

        return new Promise((resolve, reject) => {
            firestore.updateDoc(docRef, data)
                .then(() => {
                    console.log("(questionModel)updateQuestionImg:done");
                    resolve("updateQimage:done");
                })
                .catch(function (err) {
                    console.log(err);
                    reject(err);
                });
        });
    }
}