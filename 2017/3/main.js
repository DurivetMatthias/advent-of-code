const { readFile } = require("../../common/io.js")
const range = n => Array.from(Array(n).keys())

const data = readFile(__dirname)

const parsed = parseInt(data)
console.log('parsed: ', parsed)

const getCoordinates = input => {
    const ring = Math.floor((Math.ceil(Math.sqrt(input)) / 2))
    const ringSide = ring * 2 + 1
    const bottomRight = ringSide * ringSide
    const bottomCenter = bottomRight - ring
    const leftCenter = bottomRight - 3 * ring
    const topCenter = bottomRight - 5 * ring
    const rightCenter = bottomRight - 7 * ring
    const unknownDist = [bottomCenter, leftCenter, topCenter, rightCenter]
        .map((n, index) => ({ diff: input - n, index }))
        .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0]
    if (unknownDist.index === 0) {
        return {
            x: unknownDist.diff,
            y: ring,
        }
    } else if (unknownDist.index === 1) {
        return {
            x: -ring,
            y: unknownDist.diff,
        }
    } else if (unknownDist.index === 2) {
        return {
            x: -unknownDist.diff,
            y: -ring,
        }
    } else if (unknownDist.index === 3) {
        return {
            x: ring,
            y: -unknownDist.diff,
        }
    }
}
const coordinates = getCoordinates(parsed)
const manhattanDistance = Math.abs(coordinates.x) + Math.abs(coordinates.y)
console.log('manhattanDistance: ', manhattanDistance)

const rings = 5
const ringsPadded = rings + 1
const squareSize = ringsPadded * 2 - 1
const centerX = rings
const centerY = rings
const spiralNumbers = new Array(squareSize).fill(null).map(_ => new Array(squareSize).fill(0))
const printSquare = square => console.log(square.map(row => row.join("\t")).join("\n"))
const maxValueSqrt = rings * 2 - 1
range(maxValueSqrt ** 2)
    .map(n => n + 1)
    .forEach(n => {
        const offset = getCoordinates(n)
        const x = centerX + offset.x
        const y = centerY + offset.y
        if (n === 1) {
            spiralNumbers[y][x] = 1
        } else {
            spiralNumbers[y][x] = [
                spiralNumbers[y - 1][x + 1],
                spiralNumbers[y][x + 1],
                spiralNumbers[y + 1][x + 1],
                spiralNumbers[y + 1][x],
                spiralNumbers[y + 1][x - 1],
                spiralNumbers[y][x - 1],
                spiralNumbers[y - 1][x - 1],
                spiralNumbers[y - 1][x],
            ].reduce((total, n) => total + n, 0)
        }

        if (spiralNumbers[y][x] > parsed) {
            console.log('n: ', n)
            console.log('spiralNumbers[y][x]: ', spiralNumbers[y][x])
        }
    })
