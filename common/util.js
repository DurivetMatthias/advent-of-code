const range = n => Array.from(Array(n).keys())
const zip = (a, b) => a.map((k, i) => [k, b[i]])
const transpose = matrix => {
    return matrix[0].map((col, i) => matrix.map(row => row[i]))
}
const createSquare = (width, height) => {
    return new Array(height)
        .fill()
        .map(() => new Array(width).fill("."))
}
const printSquare = square => console.log(square.map(row => row.join("")).join("\n"))
var padArray = (arr, len, fill) => {
    return arr.concat(Array(len).fill(fill)).slice(0, len)
}
const repeatArray = (array, repeats) => new Array(repeats).fill().map(() => array).flat()
const manhattanDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
module.exports = {
    createSquare,
    manhattanDistance,
    padArray,
    printSquare,
    range,
    repeatArray,
    transpose,
}
