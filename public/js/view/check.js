
export function checkSIDFormat(id) {
    let idFormat = /^s\d{10}$/;
    let result = idFormat.test(id);
    return result;
}

export function checkInputTextEmpty(text) {
    return (text == "");
}