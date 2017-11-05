"use strict"

function padStart(string, length, char) {
    string = String(string)
    if (!char) {
        char = " "
    }

    while (string.length < length) {
        string = String(char) + String(string)
    }
    return string
}

function format(date, format) {
    date = convertToDate(date)
    let output = format

    output = output.replace(/y/g, () => padStart(date.getYear(), 2, "0").substr(-2))
    output = output.replace(/Y/g, () => padStart(date.getFullYear(), 4, "0"))
    output = output.replace(/n/g, () => date.getMonth() + 1)
    output = output.replace(/m/g, () => padStart(date.getMonth(), 2, "0"))
    output = output.replace(/j/g, () => date.getDate())
    output = output.replace(/d/g, () => padStart(date.getDate(), 2, "0"))

    output = output.replace(/g/g, () => {
        let output = date.getHours()
        if (output > 12) {
            output -= 12
        } 
        return output
    })
    output = output.replace(/h/g, () => {
        let output = date.getHours()
        if (output > 12) {
            output -= 12
        } 
        return padStart(output, 2, "0")
    })
    output = output.replace(/a/g, () => date.getHours() > 12 ? "pm" : "am")
    output = output.replace(/A/g, () => date.getHours() > 12 ? "PM" : "AM")
    output = output.replace(/H/g, () => padStart(date.getHours(), 2, "0"))
    output = output.replace(/i/g, () => padStart(date.getMinutes(), 2, "0"))
    output = output.replace(/s/g, () => padStart(date.getSeconds(), 2, "0"))
    
    return output
}

function convertToDate(data) {
    let output
    if (data instanceof Date) {
        output = data
    } else {
        output = new Date(data)
    }

    return output
}

function getLastDayOfMonth(year, month) {
    month = parseInt(month)
    let output = 31
    switch (month) {
        case 4:
        case 6:
        case 9:
        case 11:
            output = 30
        break

        case 2:
            output = 28

            if (year % 4 == 0) {
                output = 29
            }
            if (year % 100 == 0) {
                output = 28
            }
            if (year % 400 == 0) {
                output = 29
            }
    }

    return output
}

function diff(first_date, second_date) {
    let first_date_str, second_date_str, negative, date_1, date_1_obj, date_2, date_2_obj

    const output = {
        "seconds": 0,
        "minutes": 0,
        "hours": 0,
        "days": 0,
        "months": 0,
        "years": 0,
        "total_seconds": 0,
        "inverted": false
    }

    first_date_str = format(convertToDate(first_date), "Y-m-d H:i:s")
    second_date_str = format(convertToDate(second_date), "Y-m-d H:i:s")

    if (first_date_str <= second_date_str) {
        negative = false
        date_1 = first_date_str
        date_2 = second_date_str
        date_1_obj = convertToDate(first_date).getTime()
        date_2_obj = convertToDate(second_date).getTime()
    } else {
        negative = true
        date_1 = second_date_str
        date_2 = first_date_str
        date_1_obj = convertToDate(second_date).getTime()
        date_2_obj = convertToDate(first_date).getTime()
    }

    output.seconds = date_2.substr(-2) - date_1.substr(-2)
    output.minutes = date_2.substr(14, 2) - date_1.substr(14, 2)
    output.hours = date_2.substr(11, 2) - date_1.substr(11, 2)
    output.days = date_2.substr(8, 2) - date_1.substr(8, 2)
    output.months = date_2.substr(5, 2) - date_1.substr(5, 2)
    output.years = date_2.substr(0, 4) - date_1.substr(0, 4)

    if (output.seconds < 0) {
        output.minutes--
        output.seconds = 60 + output.seconds
    }

    if (output.minutes < 0) {
        output.hours--
        output.minutes = 60 + output.minutes
    }

    if (output.hours < 0) {
        output.days--
        output.hours = 24 + output.hours
    }

    if (output.days < 0) {
        output.months--

        const month_lastday = getLastDayOfMonth(
            date_2.substr(0, 4),
            date_2.substr(5, 2)
        )

        output.days = month_lastday + output.days
    }

    if (output.months < 0) {
        output.years--
        output.months = 12 + output.months
    }

    if (negative) {
        output.total_seconds = Math.floor((date_1_obj - date_2_obj) / 1000)
        output.inverted = true
    } else {
        output.total_seconds = Math.floor((date_2_obj - date_1_obj) / 1000)
        output.inverted = false
    }

    return output

}

function diffString(when) {
    const diff_result = diff(when, Date.now())
    let diff_str

    if (diff_result.years != 0) {
        diff_str = diff_result.years + " year" + (diff_result.years == 1 ? "" : "s")
    } else if (diff_result.months != 0) {
        diff_str = diff_result.months + " month" + (diff_result.months == 1 ? "" : "s")
    } else if (diff_result.days != 0) {
        diff_str = diff_result.days + " day" + (diff_result.days == 1 ? "" : "s")
    } else if (diff_result.hours != 0) {
        diff_str = diff_result.hours + " hour" + (diff_result.hours == 1 ? "" : "s")
    } else if (diff_result.minutes != 0) {
        diff_str = diff_result.minutes + " minute" + (diff_result.minutes == 1 ? "" : "s")
    } else {
        diff_str = diff_result.seconds + " second" + (diff_result.seconds == 1 ? "" : "s")
    }

    return diff_str
}

export default {
    "format": format,
    "diff": diff,
    "diffString": diffString
}