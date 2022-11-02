let myDB = require("../firebase/myDB");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

module.exports = class ClassModel {

    getClassData(cID) {
        let docRef = firestore.doc(firebaseDB, "classes", cID);
        return new Promise(function (resolve, reject) {
            firestore.getDoc(docRef)
                .then((snapshot) => {
                    let stuData = snapshot.data();
                    resolve(stuData);
                })
                .catch((err) => {
                    console.log("(classModel)getClassData throw a error..");
                    reject(err);
                })
        })
    }


    setClass(newClassName) {
        let colRef = firestore.collection(firebaseDB, "classes");
        let setData = {
            cName: newClassName,
            cMember: []
        }
        return new Promise((resolve, reject) => {
            firestore.addDoc(colRef, setData)
                .then((newDoc) => {
                    resolve(newDoc.id);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    setClassCID(cId) {
        let docRef = firestore.doc(firebaseDB, "classes", cId);
        let setData = {
            cID: cId
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

    setClassCMember(cId, newCMembrList) {
        let docRef = firestore.doc(firebaseDB, "classes", cId);
        let setData = {
            cMember: newCMembrList
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

    checkClassExist(newClassName) {
        let colRef = firestore.collection(firebaseDB, "classes");
        let q = firestore.where("cName", "==", newClassName);
        return new Promise((resolve, reject) => {
            firestore.getDocs(firestore.query(colRef, q))
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        let classData = doc.data();
                        if (classData["cName"] == newClassName) {
                            resolve(true);
                        }
                    })
                    resolve(false);
                })
                .catch(() => {
                    reject("something wrong on checkClassExist");
                })
        })
    }
}