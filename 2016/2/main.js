const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n")
    .map(e => e.split(""))
    .slice(0, -1)

const keypad = [
    ["x", "x", 1, "x", "x"],
    ["x", 2, 3, 4, "x"],
    [5, 6, 7, 8, 9],
    ["x", "A", "B", "C", "x"],
    ["x", "x", "D", "x", "x"],
]

const solveOneStep = (startPos, operation) => {
    const minX = {
        0: 2,
        4: 2,
        1: 1,
        3: 1,
        2: 0,
    }[startPos.y]
    const maxX = {
        0: 2,
        4: 2,
        1: 3,
        3: 3,
        2: 4,
    }[startPos.y]
    const minY = {
        0: 2,
        4: 2,
        1: 1,
        3: 1,
        2: 0,
    }[startPos.x]
    const maxY = {
        0: 2,
        4: 2,
        1: 3,
        3: 3,
        2: 4,
    }[startPos.x]
    let x = startPos.x
    let y = startPos.y
    if (operation === "R") x = x + 1
    else if (operation === "L") x = x - 1
    else if (operation === "U") y = y - 1
    else if (operation === "D") y = y + 1
    x = Math.max(x, minX)
    x = Math.min(x, maxX)
    y = Math.max(y, minY)
    y = Math.min(y, maxY)
    return { x, y }
}

const solveLine = (startPos, listOfOperations) => {
    return listOfOperations.reduce((positions, operation) => {
        const prevPos = positions.slice(-1)[0]
        const nextPos = solveOneStep(prevPos, operation)
        return [...positions, nextPos]
    }, [startPos])
}

// const positions = parsed.reduce((previousValue, line) => {
//     const startPos = previousValue.slice(-1)[0].slice(-1)[0]
//     const linePositions = solveLine(startPos, 0, 2, 0, 2, line)
//     return [...previousValue, linePositions]
// }, [[{ x: 1, y: 1 }]])
//     .slice(1)

// const partOneCode = positions
//     .map(linePositions => {
//         const endPos = linePositions.slice(-1)[0]
//         console.log('linePositions: ', linePositions.map(p => `${p.x}/${p.y}`).join("-"))
//         console.log('endPos: ', endPos)
//         // const digit = keypad[endPos.y][endPos.x]
//         const digit = keypad[endPos.y][endPos.x]
//         return digit
//     })

// console.log('partOneCode: ', partOneCode.join(""))


const positions = parsed.reduce((previousValue, line) => {
    const startPos = previousValue.slice(-1)[0].slice(-1)[0]
    const linePositions = solveLine(startPos, line)
    return [...previousValue, linePositions]
}, [[{ x: 0, y: 2 }]])
    .slice(1)
const partTwoCode = positions
    .map(linePositions => {
        const endPos = linePositions.slice(-1)[0]
        const digit = keypad[endPos.y][endPos.x]
        return digit
    })

console.log('partTwoCode: ', partTwoCode.join(""))
