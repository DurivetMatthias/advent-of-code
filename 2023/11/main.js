const { readFile } = require("../../common/io.js")
const { manhattanDistance, printSquare, transpose, range } = require("../../common/util.js")

const parsed = readFile(__dirname)

const rawUniverseGrid = parsed
    .split("\n")
    .map((row) => row.split(""))

// printSquare(rawUniverseGrid)

// const expansionFactor = 2
// const expandUniverseRows = (universe) => {
//     const expandedUniverse = universe.map((row) => {
//         const rowIsEmpty = row.every((cell) => cell === ".")
//         if (rowIsEmpty) return range(expansionFactor).map(() => row.slice())
//         else return [row.slice()]
//     })
//         .flat(1)
//     return expandedUniverse
// }

// const expandStepOne = expandUniverseRows(rawUniverseGrid)
// const expandStepTwo = transpose(expandStepOne)
// const expandStepThree = expandUniverseRows(expandStepTwo)
// const expandedUniverse = transpose(expandStepThree)

// // console.log("---------------------------------")
// // printSquare(expandedUniverse)

// let rollingId = 0
// const galaxies = expandedUniverse.map((row, y) => {
//     return row.map((cell, x) => {
//         const isGalaxy = cell === "#"
//         if (isGalaxy) {
//             rollingId++
//             return { rollingId, x, y }
//         }
//         else return null
//     })
// })
//     .flat()
//     .filter((galaxy) => galaxy !== null)

// // console.log('galaxies:', galaxies)

// const combinations = array => {
//     return array.flatMap(
//         (v, i) => array.slice(i + 1).map(w => ([v, w]))
//     )
// }

// const galaxyCombinations = combinations(galaxies)
// const distances = galaxyCombinations.map((combination) => manhattanDistance(...combination))
// const sumOfDistances = distances.reduce((a, b) => a + b)
// console.log('sumOfDistances:', sumOfDistances)

const emptyRows = new Set()
const emptyColumns = new Set()
const testEmptyRows = universe => {
    return universe.map((row) => {
        const rowIsEmpty = row.every((cell) => cell === ".")
        return rowIsEmpty
    })
}
testEmptyRows(rawUniverseGrid)
    .forEach((isEmpty, y) => {
        if (isEmpty) emptyRows.add(y)
    })
// Cols instead of rows cuz transposed
testEmptyRows(transpose(rawUniverseGrid))
    .forEach((isEmpty, x) => {
        if (isEmpty) emptyColumns.add(x)
    })

console.log('emptyRows:', emptyRows)
console.log('emptyColumns:', emptyColumns)


let rollingId = 0
const galaxies = rawUniverseGrid.map((row, y) => {
    return row.map((cell, x) => {
        const isGalaxy = cell === "#"
        if (isGalaxy) {
            rollingId++
            return { rollingId, x, y }
        }
        else return null
    })
})
    .flat()
    .filter((galaxy) => galaxy !== null)

// console.log('galaxies:', galaxies)

const combinations = array => {
    return array.flatMap(
        (v, i) => array.slice(i + 1).map(w => ([v, w]))
    )
}

const galaxyCombinations = combinations(galaxies)
const expansionFactor = 1000000
const calculateDistance = (a, b) => {
    let distance = manhattanDistance(a, b)
    const startX = Math.min(a.x, b.x)
    const endX = Math.max(a.x, b.x)
    const startY = Math.min(a.y, b.y)
    const endY = Math.max(a.y, b.y)
    const traversedColumns = range(endX - startX)
        .map((i) => startX + i)
    traversedColumns.forEach((x) => {
        if (emptyColumns.has(x)) {
            distance += expansionFactor - 1
        }
    })
    const traversedRows = range(endY - startY)
        .map((i) => startY + i)
    traversedRows.forEach((y) => {
        if (emptyRows.has(y)) {
            distance += expansionFactor - 1
        }
    })
    // console.log("--------------------")
    // console.log('a:', a)
    // console.log('b:', b)
    // console.log('traversedColumns:', traversedColumns)
    // console.log('traversedRows:', traversedRows)
    // console.log('distance:', distance)
    // console.log("--------------------")
    return distance
}
const distances = galaxyCombinations.map((combination) => calculateDistance(...combination))
const sumOfDistances = distances.reduce((a, b) => a + b)
console.log('sumOfDistances:', sumOfDistances)
