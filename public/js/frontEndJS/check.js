export function checkInputTextEmpty(text) {
    return (text == "");
}

export function checkIDStart(id) {
    // 學生(s)
    if (id.substr(0, 1) == "s") {
        return "students";
    }
    else if (id.substr(0, 2) == "tr") {
        return "teachers"
    }
    else {
        return false
    }
}

export function checkSIDFormat(id) {
    let idFormat = /^s\d{10}$/;
    let result = idFormat.test(id);
    return result;
}

export function checkTIDFormat(id) {
    let idFormat = /^tr\d{3}$/;
    let result = idFormat.test(id);
    return result;
}

