const { readFile } = require("../../common/io.js")
const { transpose, printSquare } = require("../../common/util.js")

const parsed = readFile(__dirname)
const patterns = parsed.split("\n\n")
const grids = patterns.map(pattern => {
    const lines = pattern.split("\n")
    const grid = lines.map(line => line.split(""))
    return grid
})

const findMirroredRows = grid => {
    const rows = grid.map(row => row.join(""))
    return rows.map((row, rowIndex) => {
        return rows.map((otherRow, otherRowIndex) => {

            if (rowIndex === otherRowIndex) return null
            if (otherRow === row) {
                return {
                    row,
                    index: rowIndex,
                    offset: Math.abs(rowIndex - otherRowIndex),
                    mirrorIndex: otherRowIndex,
                    totalLength: rows.length,
                }
            }
            return null
        })
    })
        .flat()
        .filter(row => row !== null)
}

const findPotentialMirrors = (mirroredRows) => {
    const mirrors = new Map()
    mirroredRows.forEach(({ index, mirrorIndex, totalLength }) => {
        const mirrorLocation = (index + mirrorIndex) / 2
        if (!mirrors.has(mirrorLocation)) {
            mirrors.set(mirrorLocation, {
                mirrorLocation,
                totalLength,
                rows: new Set(),
            })
        }
        mirrors.get(mirrorLocation).rows.add(index)

    })
    return mirrors
}

const verifyMirrors = (potentialMirrors) => {
    return Array.from(potentialMirrors.values())
        .filter(({ rows, totalLength }) => {
            const rowArray = Array.from(rows)
            const firstRow = rowArray[0]
            const lastRow = rowArray[rowArray.length - 1]
            const touchesTheEdge = firstRow === 0 || lastRow === totalLength - 1
            const isComplete = rowArray.length === lastRow - firstRow + 1
            return touchesTheEdge && isComplete
        })
}

const getMirrors = grid => {
    const potentialMirroredRows = findMirroredRows(grid)
    const potentialMirroredColumns = findMirroredRows(transpose(grid))

    const potentialHorizontalMirrors = findPotentialMirrors(potentialMirroredRows)
    const potentialVerticalMirrors = findPotentialMirrors(potentialMirroredColumns)

    const horizontalMirrors = verifyMirrors(potentialHorizontalMirrors)
    const verticalMirrors = verifyMirrors(potentialVerticalMirrors)
    return {
        horizontalMirrors,
        verticalMirrors,
    }
}

const mirrors = grids
    .map(getMirrors)

const calculateSummary = ({ verticalMirrors, horizontalMirrors }) => {
    const verticalSum = verticalMirrors
        .flat()
        .reduce((acc, mirrors) => {
            return acc + Math.ceil(mirrors.mirrorLocation)
        }, 0)
    const horizontalSum = horizontalMirrors
        .flat()
        .reduce((acc, mirrors) => {
            return acc + (100 * Math.ceil(mirrors.mirrorLocation))
        }, 0)
    return verticalSum + horizontalSum
}

const summary = mirrors
    .map(calculateSummary)
    .reduce((acc, summary) => acc + summary)

console.log('summary:', summary)

const HORIZONTAL = "horizontal"
const VERTICAL = "vertical"

const smudgedMirrors = grids.map(grid => {
    const baseMirrors = getMirrors(grid)
    let baseMirror = null
    let baseOrientation = null
    if (baseMirrors.horizontalMirrors.length === 1) {
        baseMirror = baseMirrors.horizontalMirrors[0]
        baseOrientation = HORIZONTAL
    }
    if (baseMirrors.verticalMirrors.length === 1) {
        baseMirror = baseMirrors.verticalMirrors[0]
        baseOrientation = VERTICAL
    }
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            const newGrid = JSON.parse(JSON.stringify(grid))
            newGrid[y][x] = newGrid[y][x] === "#" ? "." : "#"
            const newMirrors = getMirrors(newGrid)
            const newHorizontalMirror = newMirrors.horizontalMirrors
                .filter(newMirror => (baseOrientation !== HORIZONTAL || newMirror.mirrorLocation !== baseMirror.mirrorLocation))
            const newVerticalMirror = newMirrors.verticalMirrors
                .filter(newMirror => (baseOrientation !== VERTICAL || newMirror.mirrorLocation !== baseMirror.mirrorLocation))
            // console.log("====================================")
            // console.log('baseMirror:', baseMirror)
            // console.log('newMirrors:', newMirrors)
            // console.log('newHorizontalMirror:', newHorizontalMirror)
            // console.log('newVerticalMirror:', newVerticalMirror)
            // console.log("====================================")
            if (newHorizontalMirror.length === 1) {
                return {
                    verticalMirrors: [],
                    horizontalMirrors: [newHorizontalMirror[0]]
                }
            }
            if (newVerticalMirror.length === 1) {
                return {
                    verticalMirrors: [newVerticalMirror[0]],
                    horizontalMirrors: []
                }
            }
        }
    }
    // printSquare(grid)
})

// console.log('smudgedMirrors:', smudgedMirrors)

const smudgedSummary = smudgedMirrors
    .map(calculateSummary)
    .reduce((acc, summary) => acc + summary)
console.log('smudgedSummary:', smudgedSummary)
