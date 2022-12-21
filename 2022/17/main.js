const { readFile } = require("../../common/io.js")
const printBlocks = blocks => {
    const highestY = blocks.map(({ x, y }) => y).sort((a, b) => b - a)[0]
    const lowestY = blocks.map(({ x, y }) => y).sort((a, b) => a - b)[0]
    const grid = new Array(highestY - lowestY + 1)
        .fill()
        .map(() => new Array(7).fill("."))
    blocks.map(({ x, y }) => ({ x, y: y - lowestY })).forEach(({ x, y }) => grid[y][x] = "#")
    console.log(grid.map(row => row.join("")).reverse().join("\n"))
}

const parsed = readFile(__dirname)
    .split("")
    .map(line => line === ">" ? 1 : -1)
console.log('readFile(__dirname).length: ', readFile(__dirname).length)
console.log('parsed.length: ', parsed.length)
// console.log('parsed: ', parsed)

const rockPrototypes = [
    [ // - shape
        { x: 0, y: 0 }, // bottom
        { x: 1, y: 0 }, // bottom
        { x: 2, y: 0 }, // bottom
        { x: 3, y: 0 }, // bottom
    ], [ // + shape
        { x: 1, y: 0 }, // bottom
        { x: 0, y: 1 }, // middle
        { x: 1, y: 1 }, // middle
        { x: 2, y: 1 }, // middle
        { x: 1, y: 2 }, // top
    ], [ // reverse L shape
        { x: 0, y: 0 }, // bottom
        { x: 1, y: 0 }, // bottom
        { x: 2, y: 0 }, // bottom
        { x: 2, y: 1 }, // middle
        { x: 2, y: 2 }, // top
    ], [ // | shape
        { x: 0, y: 0 }, // bottom
        { x: 0, y: 1 }, // middle
        { x: 0, y: 2 }, // middle 2
        { x: 0, y: 3 }, // top
    ], [ // [] shape
        { x: 0, y: 0 }, // bottom
        { x: 1, y: 0 }, // bottom
        { x: 0, y: 1 }, // top
        { x: 1, y: 1 }, // top
    ]
]

const findRelevantBlocks = blocks => {
    const topBlocksPerCol = blocks
        .reduce((result, block) => {
            const newResult = { ...result }
            if (newResult[block.x] < block.y) {
                newResult[block.x] = block.y
            }
            return newResult
        }, {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
        })
    const cutoff = Object.values(topBlocksPerCol).sort((a, b) => a - b)[0]
    const relevantBlocks = blocks
        .filter(({ x, y }) => y >= cutoff)
    return relevantBlocks
}

const encodeBlock = ({ x, y }) => ([x, y].join("/"))

const testCollision = (rock, blocks) => {
    const encodedRock = rock.map(encodeBlock)
    const encodedBlocks = blocks.map(encodeBlock)
    return (
        encodedRock.some(block => encodedBlocks.includes(block))
        || rock.some(block => block.y === -1)
        || rock.some(block => block.x === -1 || block.x === 7)
    )
}

const encodeBlocks = blocks => {
    const lowY = blocks.map(({ x, y }) => y).sort((a, b) => a - b)[0]
    return blocks
        .map(({ x, y }) => ({ x, y: y - lowY }))
        .map(encodeBlock)
        .sort()
        .join(" ")
}

const simulateRocks = rockLimit => {
    const cache = {}
    let stoppedBlocks = []
    const stoppedBlocksHistory = {}
    const sideIndexHistory = {}
    let droppedRocks = 0
    let sideIndex = 0
    let cachedSolution
    while (droppedRocks < rockLimit && !Boolean(cachedSolution)) {
        let stopped = false
        let rock = JSON.parse(JSON.stringify(rockPrototypes[droppedRocks % rockPrototypes.length]))
        const highestY = stoppedBlocks.length > 0 ? stoppedBlocks.sort((a, b) => b.y - a.y)[0].y : -1
        rock = rock.map(({ x, y }) => ({ x: x + 2, y: y + highestY + 4 }))
        let nextMoveRock
        let collision
        while (!stopped) {
            // push sideways
            const sideMove = parsed[sideIndex]
            sideIndex = (sideIndex + 1) % parsed.length
            nextMoveRock = rock.map(({ x, y }) => ({ x: x + sideMove, y }))
            collision = testCollision(nextMoveRock, stoppedBlocks)
            if (!collision) {
                rock = nextMoveRock
            }
            // fall down
            nextMoveRock = rock.map(({ x, y }) => ({ x, y: y - 1 }))
            collision = testCollision(nextMoveRock, stoppedBlocks)
            if (collision) {
                stopped = true
                stoppedBlocks = [...stoppedBlocks, ...rock]
            } else {
                rock = nextMoveRock
            }
        }
        droppedRocks += 1
        stoppedBlocks = findRelevantBlocks(stoppedBlocks)
        stoppedBlocksHistory[droppedRocks] = stoppedBlocks
        sideIndexHistory[droppedRocks] = sideIndex
        const lowY = stoppedBlocks.map(({ x, y }) => y).sort((a, b) => a - b)[0]
        const encodedState = [
            encodeBlocks(stoppedBlocks.map(({ x, y }) => ({ x, y: y - lowY }))),
            sideIndex
        ].join(" ")
        if (Object.keys(cache).includes(encodedState)) {
            cachedSolution = true
        } else {
            cache[encodedState] = droppedRocks
        }
    }
    return [stoppedBlocksHistory, sideIndexHistory]
}

const findHeight = blocks => {
    return blocks
        .map(({ x, y }) => y)
        .sort((a, b) => b - a)[0] + 1
}

// const rockLimit = 2022
const rockLimit = 1000000000000
const [blocksHistory, sideIndexHistory] = simulateRocks(rockLimit)
// const partOne = findHeight(blocksHistory[2022])
// console.log('partOne :', partOne)

// const one = encodeBlocks(blocksHistory[28])
// const two = encodeBlocks(blocksHistory[63])
const secondOccurrence = parseInt(
    Object.keys(blocksHistory).sort((a, b) => parseInt(b) - parseInt(a))
)
const firstOccurrence = parseInt(
    Object.entries(blocksHistory)
        .filter(([key, value]) => (
            encodeBlocks(value) === encodeBlocks(blocksHistory[secondOccurrence])
            && sideIndexHistory[key] === sideIndexHistory[secondOccurrence]
        ))
        .map(([key, value]) => key)
)
console.log('firstOccurrence: ', firstOccurrence)
console.log('secondOccurrence: ', secondOccurrence)

const baseLayerRocks = firstOccurrence
console.log('baseLayerRocks: ', baseLayerRocks)
const baseLayerHeight = findHeight(blocksHistory[baseLayerRocks])
console.log('baseLayerHeight: ', baseLayerHeight)

const repeatLayerRocks = secondOccurrence - baseLayerRocks
console.log('repeatLayerRocks: ', repeatLayerRocks)
const repeatLayerHeight = findHeight(blocksHistory[baseLayerRocks + repeatLayerRocks]) - baseLayerHeight
console.log('repeatLayerHeight: ', repeatLayerHeight)
const repeats = Math.floor((rockLimit - baseLayerRocks) / repeatLayerRocks)
console.log('repeats: ', repeats)

const topLayerRocks = rockLimit - baseLayerRocks - repeats * repeatLayerRocks
console.log('topLayerRocks: ', topLayerRocks)
const topLayerHeight = findHeight(blocksHistory[baseLayerRocks + topLayerRocks]) - baseLayerHeight
console.log('topLayerHeight: ', topLayerHeight)

const totalRocks = baseLayerRocks + repeatLayerRocks * repeats + topLayerRocks
console.log('totalRocks: ', totalRocks)
const totalHeight = baseLayerHeight + repeatLayerHeight * repeats + topLayerHeight
console.log('totalHeight: ', totalHeight)

const test = 1514285714288
console.log('totalHeight === test: ', totalHeight === test)
const test2 = Number.MAX_SAFE_INTEGER
console.log('totalHeight >= test2: ', totalHeight >= test2)
