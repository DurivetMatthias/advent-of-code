const { readFile } = require("../../common/io.js")
const createSquare = (width, height) => {
    return new Array(height)
        .fill()
        .map(() => new Array(width).fill("."))
}
const printSquare = square => console.log(square.map(row => row.join("")).join("\n"))
const range = n => Array.from(Array(n).keys())

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => ({
        direction: line[0],
        distance: parseInt(line.slice(2)),
    }))

console.log('parsed: ', parsed)


let headPos = { x: 0, y: 0 }
let tailPos = { x: 0, y: 0 }
const tailPosTrack = [{ ...tailPos }]
const printTailTrack = track => {
    // console.log('tailPosTrack: ', tailPosTrack)
    const grid = createSquare(50, 50)
    tailPosTrack.forEach(({ x, y }) => grid[y][x] = "#")
    printSquare(grid)
}

const directionOffsets = {
    "U": { x: 0, y: 1 },
    "D": { x: 0, y: -1 },
    "R": { x: 1, y: 0 },
    "L": { x: -1, y: 0 },
}
// parsed.forEach(({ direction, distance }) => {
//     const { x: xOffset, y: yOffset } = directionOffsets[direction]
//     range(distance).forEach(() => {
//         const prevHeadPos = { ...headPos }
//         headPos.x += xOffset
//         headPos.y += yOffset
//         const diff = {
//             x: Math.abs(headPos.x - tailPos.x),
//             y: Math.abs(headPos.y - tailPos.y),
//         }
//         if (diff.x === 2 || diff.y === 2) tailPos = prevHeadPos

//         tailPosTrack.push({ ...tailPos })
//         // console.log()
//         // console.log("-".repeat(10))
//         // printTailTrack(tailPosTrack)
//     })
// })

// console.log('tailPosTrack.length: ', tailPosTrack.length)
// console.log('tailPosTrack.size: ', new Set(tailPosTrack.map(({ x, y }) => `${x}/${y}`)).size)

const knots = {
    0: { x: 0, y: 0 },
    1: { x: 0, y: 0 },
    2: { x: 0, y: 0 },
    3: { x: 0, y: 0 },
    4: { x: 0, y: 0 },
    5: { x: 0, y: 0 },
    6: { x: 0, y: 0 },
    7: { x: 0, y: 0 },
    8: { x: 0, y: 0 },
    9: { x: 0, y: 0 },
}
const printKnots = knots => {
    const grid = createSquare(50, 50)
    Object.entries(knots).reverse().forEach(([key, { x, y }]) => {
        grid[y][x] = key
    })
    printSquare(grid.reverse())
}

parsed.forEach(({ direction, distance }) => {
    const { x: xOffset, y: yOffset } = directionOffsets[direction]
    range(distance).forEach(() => {
        Object.keys(knots)
            .map(n => parseInt(n))
            .forEach(knotIndex => {
                if (knotIndex === 0) {
                    knots[knotIndex].x += xOffset
                    knots[knotIndex].y += yOffset
                } else {
                    const prevKnot = knots[knotIndex - 1]
                    const diff = {
                        x: Math.abs(prevKnot.x - knots[knotIndex].x),
                        y: Math.abs(prevKnot.y - knots[knotIndex].y),
                        modifier: {
                            x: prevKnot.x > knots[knotIndex].x ? 1 : -1,
                            y: prevKnot.y > knots[knotIndex].y ? 1 : -1,
                        }
                    }
                    if (diff.x === 2 && diff.y === 0) {
                        knots[knotIndex].x += 1 * diff.modifier.x
                    } else if (diff.x === 0 && diff.y === 2) {
                        knots[knotIndex].y += 1 * diff.modifier.y
                    } else if (diff.x === 2 && diff.y === 1) {
                        knots[knotIndex].x += 1 * diff.modifier.x
                        knots[knotIndex].y += 1 * diff.modifier.y
                    } else if (diff.x === 1 && diff.y === 2) {
                        knots[knotIndex].x += 1 * diff.modifier.x
                        knots[knotIndex].y += 1 * diff.modifier.y
                    } else if (diff.x === 2 && diff.y === 2) {
                        knots[knotIndex].x += 1 * diff.modifier.x
                        knots[knotIndex].y += 1 * diff.modifier.y
                    }
                }

                if (knotIndex === 9) tailPosTrack.push({ ...knots[knotIndex] })
            })
        // console.log()
        // console.log("-".repeat(30))
        // printKnots(knots)
    })
})

console.log('tailPosTrack.length: ', tailPosTrack.length)
console.log('tailPosTrack.size: ', new Set(tailPosTrack.map(({ x, y }) => `${x}/${y}`)).size)
