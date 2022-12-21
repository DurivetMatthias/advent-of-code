const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const makeGrid = (x, y) => {
    const grid = new Array(y).fill(null)
    return grid.map(e => new Array(x).fill(false))
}
const printGrid = grid => {
    console.log("-".repeat(grid[0].length))
    console.log()
    grid
        .forEach(row => {
            console.log(row.map(value => value ? "#" : " ").join(""))
        })
    console.log()
}
const rect = (grid, a, b) => {
    return grid.map((row, y) => {
        return row.map((currentValue, x) => {
            if (x < a && y < b) return true
            else return currentValue
        })
    })
}
const shiftRow = (grid, a, b) => {
    return grid.map((row, y) => {
        if (y === a) return [...row.slice(-b), ...row.slice(0, -b)]
        else return row
    })
}
const transpose = grid => grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
const shiftCol = (grid, a, b) => {
    const transposedGrid = transpose(grid)
    const newGrid = shiftRow(transposedGrid, a, b)
    return transpose(newGrid)
}

const parsed = data
    .split("\n")
    .map((line, index) => {
        if (line.includes("rect ")) {
            const remainder = line.replace("rect ", "")
            const [a, b] = remainder.split("x").map(e => parseInt(e))
            return {
                operation: grid => rect(grid, a, b),
                line,
                index,
            }
        } else if (line.includes("rotate row y=")) {
            const remainder = line.replace("rotate row y=", "")
            const [a, b] = remainder.split(" by ").map(e => parseInt(e))
            return {
                operation: grid => shiftRow(grid, a, b),
                line,
                index,
            }
        } else if (line.includes("rotate column x=")) {
            const remainder = line.replace("rotate column x=", "")
            const [a, b] = remainder.split(" by ").map(e => parseInt(e))
            return {
                operation: grid => shiftCol(grid, a, b),
                line,
                index,
            }
        }
    })
console.log('parsed: ', parsed)

const initialGrid = makeGrid(50, 6)
const finalGrid = parsed.reduce((intermediateGrid, element) => {
    const newGrid = element.operation(intermediateGrid)
    printGrid(newGrid)
    console.log('element.line: ', element.line)
    console.log('element.index: ', element.index)
    return newGrid
}, initialGrid)

const totalPixelsLit = finalGrid.reduce((total, row) => {
    return total + row.reduce((rowTotal, value) => {
        return rowTotal + value
    }, 0)
}, 0)
console.log('totalPixelsLit: ', totalPixelsLit)
