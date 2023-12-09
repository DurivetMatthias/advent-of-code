const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)

const OasisLines = parsed
    .split("\n")
    .map((line) => line.split(" ").map((x) => parseInt(x)))

// console.log(OasisLines)

const allEqual = arr => arr.every(val => val === arr[0])

const predictNextValue = (previousValues) => {
    let differences = previousValues
    let history = [differences]
    while (!allEqual(differences)) {
        differences = differences.slice(1).map((x, i) => differences[i + 1] - differences[i])
        history.push(differences)
    }
    const lastValues = history.map(list => list.slice(-1)[0])
    const sumOfLastValues = lastValues.reduce((a, b) => a + b, 0)
    return sumOfLastValues
}

const predictPreviousValue = (previousValues) => {
    let differences = previousValues
    let history = [differences]
    while (!allEqual(differences)) {
        differences = differences.slice(1).map((x, i) => differences[i + 1] - differences[i])
        history.push(differences)
    }
    console.log("History: ", history)
    const firstValues = history.map(list => list[0])
    console.log("First values: ", firstValues)
    const SUM = (a, b) => a + b
    const SUB = (a, b) => a - b
    const operationMap = {
        SUM: SUB,
        SUB: SUM,
    }
    let operation = SUB
    const sumOfLastValues = firstValues.reduce((a, b) => {
        const result = operation(a, b)
        operation = operationMap[operation.name]
        return result
    })
    console.log("Sum of first values: ", sumOfLastValues)
    return sumOfLastValues
}

const predictions = OasisLines.map((line) => predictPreviousValue(line))
console.log("Predictions: ", predictions)
const sumOfPredictions = predictions.reduce((a, b) => a + b, 0)
console.log("Sum of predictions: ", sumOfPredictions)
