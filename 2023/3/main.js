const { readFile } = require("../../common/io.js")
const { printSquare } = require("../../common/util.js")

const grid = readFile(__dirname)
    .split("\n")
    .map((line) => line.split(""))

printSquare(grid)

const numbers = []
const symbols = []

let numberAccumulator = ""
let pointAccumulator = []
for (let y = 0; y < grid.length; y++) {
    const column = grid[y]
    for (let x = 0; x < column.length; x++) {
        const element = column[x]
        const isNumber = !isNaN(element)
        const isSymbol = !isNumber && element !== "."

        if (isNumber) {
            numberAccumulator += element
            pointAccumulator.push({ x, y })
        } else if (isSymbol) {
            symbols.push({
                symbol: element,
                point: { x, y },
            })
        }

        if (!isNumber || x === column.length - 1) {
            if (numberAccumulator.length > 0) {
                const number = parseInt(numberAccumulator)
                const points = pointAccumulator.slice()
                numbers.push({ number, points })
                numberAccumulator = ""
                pointAccumulator = []
            }
        }
    }
}

console.log(numbers)
console.log(symbols)

const isAdjacentPoint = (point1, point2) => {
    const xDiff = Math.abs(point1.x - point2.x)
    const yDiff = Math.abs(point1.y - point2.y)
    return xDiff <= 1 && yDiff <= 1
}

const isPartNumber = (number, symbols) => {
    const numberPoints = number.points
    const symbolPoints = symbols.map(symbol => symbol.point)
    const isAdjacent = numberPoints.some(point => symbolPoints.some(symbolPoint => isAdjacentPoint(point, symbolPoint)))
    return isAdjacent
}

const partNumbers = numbers.filter(number => isPartNumber(number, symbols))
// console.log(partNumbers)
const partNumberSum = partNumbers.reduce((acc, number) => acc + number.number, 0)
// console.log(partNumberSum)

const potentialGearSymbols = symbols.filter(symbol => symbol.symbol === "*")

const isGear = (symbol, partNumbers) => {
    const symbolPoint = symbol.point
    const adjacentNumbers = partNumbers.filter(number => number.points.some(point => isAdjacentPoint(point, symbolPoint)))
    const isGear = adjacentNumbers.length === 2
    return isGear
}

const getGearRatio = (symbol, partNumbers) => {
    const symbolPoint = symbol.point
    const adjacentNumbers = partNumbers.filter(number => number.points.some(point => isAdjacentPoint(point, symbolPoint)))
    const gearRatio = adjacentNumbers.reduce((acc, number) => acc * number.number, 1)
    return gearRatio
}

const gears = potentialGearSymbols.filter(symbol => isGear(symbol, partNumbers))
const gearRatios = gears.map(gear => getGearRatio(gear, partNumbers))
console.log(gearRatios)
const sumOfGearRatios = gearRatios.reduce((acc, gearRatio) => acc + gearRatio, 0)
console.log(sumOfGearRatios)
