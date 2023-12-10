const { readFile } = require("../../common/io.js")
const { printSquare, range, transpose } = require("../../common/util.js")

const parsed = readFile(__dirname)

const grid = parsed
    .split("\n")
    .map((line, y) => line
        .split("")
        .map((character, x) => ({ character, x, y }))
    )
// console.log('grid:', grid)

const gridMinX = 0
const gridMinY = 0
const gridMaxX = grid[0].length - 1
const gridMaxY = grid.length - 1

const gridByXY = transpose(grid)
console.log('gridByXY[0][1]:', gridByXY[0][1])

const start = grid.flat().find(({ character }) => character === 'S')
console.log('start:', start)

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90 - degree bend connecting north and east.
// J is a 90 - degree bend connecting north and west.
// 7 is a 90 - degree bend connecting south and west.
// F is a 90 - degree bend connecting south and east.
// .is ground; there is no pipe in this tile.
// S is the starting position of the animal;
// there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

const characterToNeighbors = {
    '|': ({ x, y }) => [{ x, y: y - 1 }, { x, y: y + 1 }],
    '-': ({ x, y }) => [{ x: x - 1, y }, { x: x + 1, y }],
    'L': ({ x, y }) => [{ x, y: y - 1 }, { x: x + 1, y }],
    'J': ({ x, y }) => [{ x, y: y - 1 }, { x: x - 1, y }],
    '7': ({ x, y }) => [{ x: x - 1, y }, { x, y: y + 1 }],
    'F': ({ x, y }) => [{ x: x + 1, y }, { x, y: y + 1 }],
}

const connectingPipes = []
let up
let down
let left
let right
if (start.y > gridMinY) {
    up = gridByXY[start.x][start.y - 1]
    if (["|", "7", "F"].includes(up.character)) connectingPipes.push(up)
}
if (start.y < gridMaxY) {
    down = gridByXY[start.x][start.y + 1]
    if (["|", "J", "L"].includes(down.character)) connectingPipes.push(down)
}
if (start.x > gridMinX) {
    left = gridByXY[start.x - 1][start.y]
    if (["-", "L", "F"].includes(left.character)) connectingPipes.push(left)
}
if (start.y < gridMaxX) {
    right = gridByXY[start.x + 1][start.y]
    if (["-", "J", "7"].includes(right.character)) connectingPipes.push(right)
}

if (connectingPipes.length !== 2) {
    console.log('connectingPipes:', connectingPipes)
    throw new Error("Too many connecting pipes")
}

// Replace S with sensible character
const isUp = connectingPipes.includes(up)
const isDown = connectingPipes.includes(down)
const isLeft = connectingPipes.includes(left)
const isRight = connectingPipes.includes(right)
if (isUp && isDown) start.character = "|"
if (isLeft && isRight) start.character = "-"
if (isUp && isRight) start.character = "L"
if (isUp && isLeft) start.character = "J"
if (isDown && isLeft) start.character = "7"
if (isDown && isRight) start.character = "F"
console.log('new start:', start)

let clockwise = connectingPipes[0]
let counterClockwise = connectingPipes[1]

const visitedPipes = new Set()
visitedPipes.add(start)
visitedPipes.add(clockwise)
visitedPipes.add(counterClockwise)
let steps = 1

while (clockwise !== counterClockwise) {
    // console.log("Start of loop")
    // console.log('steps:', steps)
    // console.log('clockwise:', clockwise)
    // console.log('counterClockwise:', counterClockwise)
    // console.log("------------------")
    const clockwiseNeighborsOps = characterToNeighbors[clockwise.character](clockwise)
    const clockwiseNeighbors = clockwiseNeighborsOps.map(({ x, y }) => gridByXY[x][y])
    clockwise = clockwiseNeighbors.find(pipe => !visitedPipes.has(pipe))
    const counterClockwiseNeighborsOps = characterToNeighbors[counterClockwise.character](counterClockwise)
    const counterClockwiseNeighbors = counterClockwiseNeighborsOps.map(({ x, y }) => gridByXY[x][y])
    counterClockwise = counterClockwiseNeighbors.find(pipe => !visitedPipes.has(pipe))
    steps++
    visitedPipes.add(clockwise)
    visitedPipes.add(counterClockwise)
    // console.log("End of loop")
    // console.log('steps:', steps)
    // console.log('clockwise:', clockwise)
    // console.log('counterClockwise:', counterClockwise)
    // console.log("------------------")
}

console.log('steps:', steps)

const verticalWallSearchExpression = "(\\||L[-IO]*7|F[-IO]*J)"

const insideTiles = grid
    .flat()
    .filter((tile) => {
        if (visitedPipes.has(tile)) return false

        // const horizontalWallSearchExpression = "\||F{1}[-IO]*L{1}|F{1}[-IO]*J{1}"
        // ------------
        // TO THE RIGHT
        // ------------
        const pointsToTheRight = gridMaxX - tile.x
        const tilesToTheRight = range(pointsToTheRight)
            .map(offset => offset + 1)
            .map(offset => gridByXY[tile.x + offset][tile.y])

        const rightTileString = tilesToTheRight
            .filter(tile => visitedPipes.has(tile))
            .map(tile => tile.character).join("")
        const allMatchesRight = [...rightTileString.matchAll(verticalWallSearchExpression, "g")]
        const amountOfWallsRight = allMatchesRight.length

        // // ------------
        // // TO THE LEFT
        // // ------------
        // const pointsToTheLeft = tile.x - gridMinX
        // const tilesToTheLeft = range(pointsToTheLeft)
        //     .map(offset => offset)
        //     .map(offset => gridByXY[offset][tile.y])

        // const leftTileString = tilesToTheLeft
        //     .filter(tile => visitedPipes.has(tile))
        //     .map(tile => tile.character).join("")
        // const allMatchesLeft = [...leftTileString.matchAll(verticalWallSearchExpression, "g")]

        // let amountOfVerticalWallsLeft = allMatchesLeft.length
        // amountOfVerticalWallsLeft += leftTileString.split("").filter(character => character === "|").length

        // // ------------
        // // TO THE TOP
        // // ------------
        // const pointsToTheTop = tile.y - gridMinY
        // const tilesToTheTop = range(pointsToTheTop)
        //     .map(offset => offset)
        //     .map(offset => gridByXY[tile.x][offset])

        // const topTileString = tilesToTheTop
        //     .filter(tile => visitedPipes.has(tile))
        //     .map(tile => tile.character).join("")
        // const allMatchesTop = [...topTileString.matchAll(horizontalWallSearchExpression, "g")]

        // let amountOfWallsTop = allMatchesTop.length
        // amountOfWallsTop += topTileString.split("").filter(character => character === "-").length

        // // ------------
        // // TO THE BOTTOM
        // // ------------
        // const pointsToTheBottom = gridMaxY - tile.y
        // const tilesToTheBottom = range(pointsToTheBottom)
        //     .map(offset => offset + 1)
        //     .map(offset => gridByXY[tile.x][tile.y + offset])

        // const bottomTileString = tilesToTheBottom
        //     .filter(tile => visitedPipes.has(tile))
        //     .map(tile => tile.character).join("")
        // const allMatchesBottom = [...bottomTileString.matchAll(horizontalWallSearchExpression, "g")]

        // let amountOfWallsBottom = allMatchesBottom.length
        // amountOfWallsBottom += bottomTileString.split("").filter(character => character === "-").length

        // const oddLayersToTheRight = amountOfVerticalWallsRight % 2 === 1
        // const oddLayersToTheLeft = amountOfVerticalWallsLeft % 2 === 1
        // const noWallsRight = amountOfVerticalWallsRight === 0
        // const noWallsLeft = amountOfVerticalWallsLeft === 0

        // const oddLayersToTheTop = amountOfWallsTop % 2 === 1
        // const oddLayersToTheBottom = amountOfWallsBottom % 2 === 1
        // const noWallsTop = amountOfWallsTop === 0
        // const noWallsBottom = amountOfWallsBottom === 0

        // const isInside = (!noWallsLeft &&
        //     !noWallsRight &&
        //     !noWallsTop &&
        //     !noWallsBottom &&
        //     (
        //         oddLayersToTheRight ||
        //         oddLayersToTheLeft ||
        //         oddLayersToTheTop ||
        //         oddLayersToTheBottom
        //     ))

        const isInside = amountOfWallsRight % 2 === 1

        if ((!isInside && tile.character === "I") || (isInside && tile.character !== "I")) {
            console.log("------------------")
            console.log('tile:', tile)

            console.log('rightTileString:', rightTileString)
            console.log('allMatchesRight:', allMatchesRight)
            console.log('amountOfWallsRight:', amountOfWallsRight)

            // console.log('leftTileString:', leftTileString)
            // console.log('amountOfVerticalWallsLeft:', amountOfVerticalWallsLeft)

            // console.log('topTileString:', topTileString)
            // console.log('amountOfWallsTop:', amountOfWallsTop)

            // console.log(tilesToTheBottom.map(tile => tile.character).join(""))
            // console.log('bottomTileString:', bottomTileString)
            // console.log('amountOfWallsBottom:', amountOfWallsBottom)

            console.log('isInside:', isInside)
        }

        return isInside
    })
console.log('insideTiles:', insideTiles)
console.log('insideTiles.length:', insideTiles.length)

const debugGrid = grid.map(line => line.map(tile => {
    if (tile.character === "I") return "I"
    if (visitedPipes.has(tile)) return tile.character
    else return "."
}))
printSquare(debugGrid)
