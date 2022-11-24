let myDB = require("../firebase/myDB");
let MobileDetect  = require("mobile-detect");
let firebaseDB = myDB.myDatabase;
let firestore = myDB.firestore;

function getDateAndTime(req) {
    // https://worldtimeapi.org/api/timezone/Asia/Taipei
    let now = new Date();
    
    let md = new MobileDetect(req.headers['user-agent']);
    // let offset = now.getTimezoneOffset() / 60;
    let dt;
    if( (md.is('iPhone')) || ( md.os() === "iOS" ) || ( md.os() === "iPadOS" ) ){
        dt = now.setHours(now.getHours() + 8);
    }
    else{
        dt = now.setHours(now.getHours());
    }

    let newDate = new Date(dt);
    return newDate.toLocaleString("ja-JP");
}

function getExamRecordByExRecID(exRecID) {
    let docRef = firestore.doc(firebaseDB, "examRecords", exRecID);

    return new Promise((resolve, reject) => {
        firestore.getDoc(docRef)
            .then((snapshot) => {
                resolve(snapshot.data());
            })
            .catch((err) => {
                reject(err);
            });
    })
}

function makeExamRecordUnitCal(resultList) {
    // 統計各單元作答狀況
    let qUnitCal = [];

    for (let i = 1; i < 5; i++) {
        let unitCal = {};
        // 設定單元碼
        unitCal["unit"] = i;

        // 設定此單元總題數
        let unitNums = resultList.filter((q) => q.qUnit == i);
        unitCal["qNum"] = unitNums.length;

        // 設定此單元正確答題數
        let unitCorNums = unitNums.filter((q) => q.qCorrect == true);
        unitCal["qCor"] = unitCorNums.length;

        qUnitCal.push(unitCal);
    }

    return qUnitCal;
}

function makeExamRecordData(req, correctNum, resultList) {
    let record = {};
    record["timeInfo"] = getDateAndTime(req);
    record["sID"] = req.session.name;
    record["qCorrectNum"] = correctNum;
    record["qNum"] = resultList.length;
    record["qList"] = resultList.map((ans) => {
        return ans.qId;
    });
    record["qUnitCal"] = makeExamRecordUnitCal(resultList);
    return record;
}

function getExRecUint(qUnitCal) {
    let quizUnit = qUnitCal.filter((unit) => {
        return unit.qNum == 10
    });

    let unit = "";

    // 此處測驗為總複習
    if (quizUnit.length === 0) {
        unit = "unitAll";
    }
    else {
        // 此處測驗為單元測驗
        if (quizUnit[0].unit == 1) {
            unit = "unit1";
        }
        if (quizUnit[0].unit == 2) {
            unit = "unit2";
        }
        if (quizUnit[0].unit == 3) {
            unit = "unit3";
        }
        if (quizUnit[0].unit == 4) {
            unit = "unit4";
        }
    }

    return unit;
}

function dealRadarData(exRecords) {
    let unitCal = {
        unit1: { qNum: 0, qCorNum: 0 },
        unit2: { qNum: 0, qCorNum: 0 },
        unit3: { qNum: 0, qCorNum: 0 },
        unit4: { qNum: 0, qCorNum: 0 },
    };

    exRecords.forEach(rec => {
        for (let i = 0; i < rec.length; i++) {
            let unitIndex = "unit" + (i + 1);
            unitCal[unitIndex].qCorNum += rec[i].qCor;
            unitCal[unitIndex].qNum += rec[i].qNum;
        }
    });

    let unitAccuracy = [];

    for (let i = 0; i < 4; i++) {
        let unitIndex = "unit" + (i + 1);

        // 避免讓被除數=0
        if (unitCal[unitIndex].qNum == 0) {
            unitAccuracy.push(0);
        }
        else {
            unitAccuracy.push(unitCal[unitIndex].qCorNum / unitCal[unitIndex].qNum);
        }

    }

    return unitAccuracy;
}

function dealUnitNum(exRecords) {
    let unitNumResult = { unit1: 0, unit2: 0, unit3: 0, unit4: 0, unitAll: 0 };
    exRecords.forEach(rec => {

        let unit = getExRecUint(rec);
        unitNumResult[unit]++;

        // let quizUnit = rec.filter((unit) => {
        //     return unit.qNum == 10
        // });

        // // 此處測驗為總複習
        // if (quizUnit.length === 0) {
        //     unitNumResult.unitAll++;
        // }
        // else {
        //     // 此處測驗為單元測驗
        //     if (quizUnit[0].unit == 1) {
        //         unitNumResult.unit1++;
        //     }
        //     if (quizUnit[0].unit == 2) {
        //         unitNumResult.unit2++;
        //     }
        //     if (quizUnit[0].unit == 3) {
        //         unitNumResult.unit3++;
        //     }
        //     if (quizUnit[0].unit == 4) {
        //         unitNumResult.unit4++;
        //     }
        // }

    });

    return unitNumResult;
}

function dealBarData(exRecords) {
    exRecords.sort((prev, next) => {
        let prevDate = new Date(prev.time);
        let nextDate = new Date(next.time);

        if (prevDate < nextDate) {
            return -1;
        }
        else if (prevDate > nextDate) {
            return 1
        }
        else {
            return 0;
        }
    });

    let barData = {
        data: [],
        label: []
    };

    if (exRecords.length > 5) {
        exRecords = exRecords.slice(exRecords.length - 5, exRecords.length);
    }

    exRecords.forEach((rec) => {
        barData.data.push(rec.qCor / rec.qNum)
        barData.label.push(rec.time);
    })

    return barData;
}

module.exports = class ExamRecordModel {
    setExamRecord(req, correctNum, resultList) {
        let colRef = firestore.collection(firebaseDB, "examRecords");
        let setData = makeExamRecordData(req, correctNum, resultList);

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

    getExamRecord(id) {
        let colRef = firestore.collection(firebaseDB, "examRecords");
        let q = firestore.where("sID", "==", id);

        return new Promise((resolve, reject) => {
            firestore.getDocs(firestore.query(colRef, q))
                .then((snapshot) => {
                    let exRecList = [];
                    snapshot.forEach((rec) => {
                        exRecList.push(rec.data());
                    })
                    resolve(exRecList);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    async calcStudentExamRecords(examRecords) {

        let barData = {};
        let radarData = [];
        let totalNum = 0;
        let totalQNum = 0
        let totalRate = 0;
        let lastTestTime = "";
        let unitNum = {};

        let unitCalList = [];
        let sortRecList = [];

        for (let i = 0; i < examRecords.length; i++) {
            let exRecData = await getExamRecordByExRecID(examRecords[i]);
            // console.log(exRecData);
            totalNum += exRecData["qNum"];
            totalQNum += exRecData["qCorrectNum"];
            unitCalList.push(exRecData["qUnitCal"]);

            let shortRecData = {
                qNum: exRecData["qNum"],
                qCor: exRecData["qCorrectNum"],
                time: exRecData["timeInfo"]
            }
            sortRecList.push(shortRecData);
        };

        totalRate = totalQNum / totalNum;
        radarData = dealRadarData(unitCalList);
        unitNum = dealUnitNum(unitCalList);
        barData = dealBarData(sortRecList);
        lastTestTime = barData.label[barData.label.length - 1];

        let calcData = {
            radarData: radarData,
            totalNum: totalNum,
            totalQNum: totalQNum,
            totalRate: totalRate,
            unitNum: unitNum,
            barData: barData,
            lastTestTime: lastTestTime
        }

        return calcData;

    }

    async calcClassStat(examRecords) {

        let radarData = [];
        let unitCalList = [];
        let unitAccuracyList = [];

        for (let i = 0; i < examRecords.length; i++) {
            let exRecData = await getExamRecordByExRecID(examRecords[i]);
            unitCalList.push(exRecData["qUnitCal"]);

            // 分布圖
            let unitAccuracy = {
                accuracy: exRecData["qCorrectNum"] / exRecData["qNum"],
                unit: getExRecUint(exRecData["qUnitCal"])
            };
            unitAccuracyList.push(unitAccuracy);
        };

        // 雷達圖
        radarData = dealRadarData(unitCalList);

        let calcData = {
            radarData: radarData,
            unitAccuracyList: unitAccuracyList
        }

        return calcData;

    }
}