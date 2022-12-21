const { readFile } = require("../../common/io.js")
const range = n => Array.from(Array(n).keys())
const createSquare = (width, height) => {
    return new Array(height)
        .fill()
        .map(() => new Array(width).fill("."))
}

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => line
        .split(" -> ")
        .map(pos => pos
            .split(",")
            .map(n => parseInt(n))
        )
        .map(pos => ({ x: pos[0], y: pos[1] }))
    )

const largestX = parsed.flat().map(pos => pos.x).sort((a, b) => b - a)[0]
const largestY = parsed.flat().map(pos => pos.y).sort((a, b) => b - a)[0]
const smallestX = parsed.flat().map(pos => pos.x).sort((a, b) => a - b)[0]
const sandOrigin = { x: 500, y: 0 }
const cave = createSquare(largestX - smallestX + 10, largestY + 3)

cave[sandOrigin.y][sandOrigin.x - smallestX] = "+"
parsed.forEach(formation => {
    formation
        .slice(0, -1)
        .forEach((pos, i) => {
            const nextPos = formation[i + 1]
            const xDiff = Math.abs(pos.x - nextPos.x)
            if (xDiff > 0) {
                range(xDiff + 1)
                    .forEach(offset => {
                        if (pos.x > nextPos.x) cave[pos.y][pos.x - offset - smallestX] = "#"
                        if (pos.x < nextPos.x) cave[pos.y][pos.x + offset - smallestX] = "#"
                    })
            }
            const yDiff = Math.abs(pos.y - nextPos.y)
            if (yDiff > 0) {
                range(yDiff + 1)
                    .forEach(offset => {
                        if (pos.y > nextPos.y) cave[pos.y - offset][pos.x - smallestX] = "#"
                        if (pos.y < nextPos.y) cave[pos.y + offset][pos.x - smallestX] = "#"
                    })
            }
        })
})
// printSquare(cave)

const simulateSandUnit = (cave, sandOrigin) => {
    const caveCopy = JSON.parse(JSON.stringify(cave))
    // const caveCopy = JSON.parse(JSON.stringify(cave))

    if (caveCopy[sandOrigin.y][sandOrigin.x] === "o") {
        // Stop condition part 2
        return caveCopy
    }
    const currentPos = { x: sandOrigin.x, y: sandOrigin.y }
    let previousPos = { x: -1, y: -1 }
    let restingPos
    while (JSON.stringify(currentPos) !== JSON.stringify(previousPos) && !restingPos) {
        previousPos = { ...currentPos }
        if (currentPos.y >= caveCopy.length - 1) {
            // Stop condition part 1
        } else if (caveCopy[currentPos.y + 1][currentPos.x] === ".") {
            currentPos.y = currentPos.y + 1
            currentPos.x = currentPos.x
        } else if (caveCopy[currentPos.y + 1][currentPos.x - 1] === ".") {
            currentPos.y = currentPos.y + 1
            currentPos.x = currentPos.x - 1
        } else if (caveCopy[currentPos.y + 1][currentPos.x + 1] === ".") {
            currentPos.y = currentPos.y + 1
            currentPos.x = currentPos.x + 1
        } else {
            restingPos = { ...currentPos }
        }
    }
    if (restingPos) caveCopy[restingPos.y][restingPos.x] = "o"
    return caveCopy
}

const overfilledCave = cave
    .map((row, y) => {
        return row
            .map((value, x) => {
                if (value === "#") return value
                if (x >= sandOrigin.x - smallestX - y && x - smallestX <= sandOrigin.x + y) {
                    return "o"
                } else return value
            })
    })
overfilledCave[overfilledCave.length - 1] = overfilledCave[overfilledCave.length - 1].map(() => "#")
const realCave = overfilledCave

realCave
    .forEach((row, y) => {
        if (y === 0) return row
        return row
            .forEach((_, x) => {
                const value = realCave[y][x]
                if (value === "o") {
                    if (
                        overfilledCave[y - 1][x - 1] === "o"
                        || overfilledCave[y - 1][x] === "o"
                        || overfilledCave[y - 1][x + 1] === "o"
                    ) realCave[y][x] = "o"
                    else realCave[y][x] = "."
                }
            })
    })
const amountOfSand = realCave
    .flat()
    .filter(x => x === "o")
    .length

// console.log('realCave: ', realCave)
const sandBooleanGrid = realCave.map(row => row.map(square => square === "o"))
console.log(sandBooleanGrid)
