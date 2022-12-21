const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => line.split(""))
// console.log('parsed: ', parsed)

const elves = parsed.map((row, y) => {
    return row.map((value, x) => value === "#" ? { x, y } : null)
}).flat().filter(elf => elf !== null)
// console.log('elves: ', elves)

const encode = ({ x, y }) => [x, y].join("/")
const decode = encoding => {
    const [x, y] = encoding.split("/").map(n => parseInt(n))
    return { x, y }
}

const union = (setA, setB) => {
    const _union = new Set(setA);
    for (const elem of setB) {
        _union.add(elem);
    }
    return _union;
}

const intersection = (setA, setB) => {
    const _intersection = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

const getNorthSet = ({ x, y }) => new Set([-1, 0, 1].map(newX => ({ x: x + newX, y: y - 1 })).map(encode))
const getSouthSet = ({ x, y }) => new Set([-1, 0, 1].map(newX => ({ x: x + newX, y: y + 1 })).map(encode))
const getWestSet = ({ x, y }) => new Set([-1, 0, 1].map(newY => ({ x: x - 1, y: y + newY })).map(encode))
const getEastSet = ({ x, y }) => new Set([-1, 0, 1].map(newY => ({ x: x + 1, y: y + newY })).map(encode))
const getAllDirectionSet = pos => union(union(getNorthSet(pos), getSouthSet(pos)), union(getWestSet(pos), getEastSet(pos)))

const directions = [getNorthSet, getSouthSet, getWestSet, getEastSet]

const createSquare = (width, height) => {
    return new Array(height)
        .fill()
        .map(() => new Array(width).fill("."))
}
const printSquare = square => console.log(square.map(row => row.join(" ")).join("\n"))
const printElves = elves => {
    const minX = Math.min(...elves.map(({ x }) => x))
    const maxX = Math.max(...elves.map(({ x }) => x))
    const minY = Math.min(...elves.map(({ y }) => y))
    const maxY = Math.max(...elves.map(({ y }) => y))
    const square = createSquare(maxX - minX + 1, maxY - minY + 1)
    elves.map(({ x, y }) => ({ x: x - minX, y: y - minY })).forEach(({ x, y }) => square[y][x] = "#")
    printSquare(square)
}

const setEquality = (setA, setB) => {
    const total = union(setA, setB)
    return total.size === setA.size
}

const explore = () => {
    let rounds = 0
    let lastElfSet = new Set()
    let currentElfSet = new Set(elves.map(encode))
    while (!setEquality(lastElfSet, currentElfSet)) {
        // first half
        elves.forEach(elf => {
            const adjacentPositions = getAllDirectionSet(elf)
            const noNeighbors = intersection(currentElfSet, adjacentPositions).size === 0
            if (noNeighbors) elf.proposedMove = null
            else {
                directions.forEach(getDirectionSet => {
                    if (!elf.proposedMove) {
                        const directionSet = getDirectionSet(elf)
                        const noOtherElves = intersection(currentElfSet, directionSet).size === 0
                        if (noOtherElves) elf.proposedMove = decode([...directionSet][1])
                        else elf.proposedMove = null
                    }
                })
            }
        })
        // second half
        elves.filter(elf => elf.proposedMove !== null).forEach(elf => {
            const proposedMoves = elves.map(elf => elf.proposedMove).filter(move => move !== null).map(encode)
            const sameMoves = proposedMoves.filter(encoding => encoding === encode(elf.proposedMove))
            if (sameMoves.length === 1) {
                elf.x = elf.proposedMove.x
                elf.y = elf.proposedMove.y
            }
        })
        // cleanup
        const firstDirection = directions.shift()
        directions.push(firstDirection)
        elves.forEach(elf => {
            delete elf.proposedMove
        })
        rounds += 1
        lastElfSet = currentElfSet
        currentElfSet = new Set(elves.map(encode))
        // console.log('rounds: ', rounds)
        // printElves(elves)
        if (rounds % 10 === 0) console.log('rounds: ', rounds)
    }
    return rounds
}
const lastRound = explore()

const northMostElf = Math.min(...elves.map(({ y }) => y))
const southMostElf = Math.max(...elves.map(({ y }) => y))
const westMostElf = Math.min(...elves.map(({ x }) => x))
const eastMostElf = Math.max(...elves.map(({ x }) => x))

const w = southMostElf - northMostElf + 1
const h = eastMostElf - westMostElf + 1
const surface = w * h
const emptySpace = surface - elves.length
console.log('emptySpace: ', emptySpace)
console.log('lastRound: ', lastRound)
