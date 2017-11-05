"use strict"
function humanize(number) {
    let output;
    if (number < 1000) {
        output = String(number);
    } else {
        output = (Math.floor(number / 100) / 10) + "K";
    }

    return output;
}
export default {
    "humanize": humanize
}