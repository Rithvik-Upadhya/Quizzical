export function decodeHTML(inputStr) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = inputStr;
    return textarea.value;
}