const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")

const getLineOfSightNeighbors = (grid, x, y) => {
    const offsets = [
        range(grid.length).filter(distance => distance !== 0).map(distance => ({ x: x + distance, y: y })),
        range(grid.length).filter(distance => distance !== 0).map(distance => ({ x: x, y: y + distance })),
        range(grid.length).filter(distance => distance !== 0).map(distance => ({ x: x - distance, y: y })),
        range(grid.length).filter(distance => distance !== 0).map(distance => ({ x: x, y: y - distance })),
    ]
    return offsets
        .map(offsetGroup => {
            return offsetGroup
                .map(offset => {
                    if (offset.x >= 0 && offset.x < grid[0].length && offset.y >= 0 && offset.y < grid.length) {
                        return offset
                    } else return null
                })
                .filter(pos => Boolean(pos))
        })
}

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => line.split("").map(n => parseInt(n)))

console.log('parsed: ', parsed)

// const visibleTrees = parsed
//     .map((row, y) => {
//         return row.map((treeHeight, x) => {
//             if (x === 0 || y === 0 || x === parsed[0].length - 1 || y === parsed.length - 1) return true
//             const linesOfSight = getLineOfSightNeighbors(parsed, x, y)
//             return linesOfSight.some(losGroup => {
//                 return losGroup.every(neighbor => {
//                     const otherTreeHeight = parsed[neighbor.y][neighbor.x]
//                     return treeHeight > otherTreeHeight
//                 })
//             })
//         })
//     })
//     .flat()
//     .reduce((total, visible) => total + visible, 0)

// console.log('visibleTrees: ', visibleTrees)

const scenicScores = parsed
    .map((row, y) => {
        return row.map((treeHeight, x) => {
            const linesOfSight = getLineOfSightNeighbors(parsed, x, y)
            return linesOfSight.map(losGroup => {
                // console.log('losGroup: ', losGroup)
                if (losGroup.length === 0) {
                    console.log(losGroup)
                    return 0
                }
                const visibleTrees = losGroup.map(neighbor => {
                    const otherTreeHeight = parsed[neighbor.y][neighbor.x]
                    return treeHeight > otherTreeHeight
                })
                const index = visibleTrees.findIndex(x => x === false)
                if (index === -1) return losGroup.length
                return index + 1

                // })
            }).reduce((total, distanceToFirstTree) => total * distanceToFirstTree, 1)
        })
    })
console.log('scenicScores: ', scenicScores)

const bestScore = scenicScores
    .flat()
    .sort((a, b) => b - a)[0]
console.log('bestScore: ', bestScore)
