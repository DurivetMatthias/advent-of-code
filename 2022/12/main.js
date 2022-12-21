const { readFile } = require("../../common/io.js")
const printSquare = square => console.log(square.map(row => row.join("")).join("\n"))
const createSquare = (height, width) => {
    return new Array(height)
        .fill()
        .map(() => new Array(width).fill("."))
}

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => line
        .split("")
        .map(c => c.charCodeAt(0))
        .map(n => {
            if (n === "S".charCodeAt(0)) return "S"
            else if (n === "E".charCodeAt(0)) return "E"
            else return n - "a".charCodeAt(0)
        })
    )

// console.log('parsed: ', parsed)
// printSquare(parsed)

const getNeighbors = (grid, x, y) => {
    const offsets = [
        { x: x + 1, y: y },
        { x: x, y: y + 1 },
        { x: x - 1, y: y },
        { x: x, y: y - 1 },
    ]
    return offsets
        .filter(offset => (
            offset.x >= 0
            && offset.x < grid[0].length
            && offset.y >= 0
            && offset.y < grid.length
        ))
}

const encodePos = pos => `${pos.x}-${pos.y}`

const depthFirstPathSearch = (maze, startPos) => {
    const visited = new Set()
    const queue = new Array(startPos)
    let first
    let steps = 0
    while (queue.length > 0 && !first) {
        const chosenNode = queue.shift()
        const currentValue = maze[chosenNode.y][chosenNode.x]
        const neighbors = getNeighbors(maze, chosenNode.x, chosenNode.y)
        neighbors
            .filter(neighbor => {
                const neighborValue = maze[neighbor.y][neighbor.x]
                return (
                    (currentValue === "S" && neighborValue === 0)
                    || neighborValue <= currentValue + 1
                    || neighborValue === "E"
                )
            })
            .map(neighbor => ({
                ...neighbor,
                history: chosenNode.history + 1
            }))
            .forEach(neighbor => {
                const neighborValue = maze[neighbor.y][neighbor.x]
                if (neighborValue === "E" && currentValue === "z".charCodeAt(0) - "a".charCodeAt(0)) {
                    first = chosenNode
                }
                if (!visited.has(encodePos(neighbor))) queue.push(neighbor)
                visited.add(encodePos(chosenNode))
                visited.add(encodePos(neighbor))
            })
        steps += 1
    }
    return first
}
const startPos = parsed.map((row, y) => row
    .map((value, x) => ({ value, x, y }))
    .filter(e => e.value === "S")
).flat()[0]
const result = depthFirstPathSearch(parsed, { ...startPos, history: 0 })
console.log('min steps: ', result.history + 1)

parsed[startPos.y][startPos.x] = 0
// const viz = createSquare(20, 20)
// result.history.forEach(pos => viz[pos.y][pos.x] = "#")
// printSquare(viz)

const validStartPositions = parsed
    .map((row, y) => row
        .map((value, x) => ({ value, x, y }))
    )
    .flat()
    .filter(({ value }) => value === 0)
console.log('validStartPositions: ', validStartPositions)

const validPaths = validStartPositions
    .map(startPos => depthFirstPathSearch(parsed, { ...startPos, history: 0 }))
    .sort((a, b) => a.history - b.history)
console.log('validPaths: ', validPaths)

const shortestTrail = validPaths[0]
console.log('shortestTrail: ', shortestTrail.history + 1)
