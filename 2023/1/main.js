const { readFile } = require("../../common/io.js")

const digitsAsWords = {
    "zero": "0",
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9"
}

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => ({
        line: line,
        firstDigit: {
            index: line.split("").findIndex(char => !isNaN(char)),
            value: line.split("").find(char => !isNaN(char))
        },
        lastDigit: {
            index: line.length - 1 - line.split("").reverse().findIndex(char => !isNaN(char)),
            value: line.split("").reverse().find(char => !isNaN(char))
        },
        firstWrittenDigit: Object.keys(digitsAsWords)
            .map(word => ({
                index: line.indexOf(word),
                value: digitsAsWords[word]
            }))
            .filter(({ index }) => index !== -1)
            .sort((a, b) => a.index - b.index).at(0),
        lastWrittenDigit: Object.keys(digitsAsWords)
            .map(word => ({
                index: line.lastIndexOf(word),
                value: digitsAsWords[word]
            }))
            .sort((a, b) => a.index - b.index).at(-1)
    }))
    .map(({ firstDigit, lastDigit, ...other }) => ({
        ...other,
        firstDigit: firstDigit.index !== -1 ? firstDigit : { index: Infinity },
        lastDigit: lastDigit.value === undefined ? { index: -Infinity } : lastDigit,
    }))
    .map(({ firstWrittenDigit, ...other }) => ({
        ...other,
        firstWrittenDigit: firstWrittenDigit === undefined ? { index: Infinity } : firstWrittenDigit
    }))

console.log('parsed:', parsed)

const parsed2 = parsed
    .map(({ firstDigit, lastDigit, firstWrittenDigit, lastWrittenDigit }) => ({
        calibrationValue: {
            start: firstDigit.index < firstWrittenDigit.index ? firstDigit.value : firstWrittenDigit.value,
            end: lastDigit.index > lastWrittenDigit.index ? lastDigit.value : lastWrittenDigit.value
        }
    }))
    .map(({ calibrationValue, ...other }) => ({
        ...other,
        calibrationValue: parseInt(calibrationValue.start + calibrationValue.end)
    }))

console.log('parsed:', parsed2)
const sum = parsed2.map(({ calibrationValue }) => calibrationValue).reduce((partialSum, a) => partialSum + a, 0)
console.log('sum:', sum)
