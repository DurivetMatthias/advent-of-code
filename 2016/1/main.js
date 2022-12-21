const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split(", ")
    .map(instruction => ({
        direction: instruction[0],
        amount: parseInt(instruction.slice(1))
    }))

const findVector = (result, currentValue, index) => {
    const dimension = index % 2 === 0 ? "vertical" : "horizontal"
    const previousModifier = index === 0 ? +1 : result.slice(-1)[0].modifier

    let currentModifier
    if (dimension === "horizontal") {
        if (previousModifier === +1) {
            if (currentValue.direction === "L") {
                currentModifier = -1
            } else if (currentValue.direction === "R") {
                currentModifier = +1
            }
        } else if (previousModifier === -1) {
            if (currentValue.direction === "L") {
                currentModifier = +1
            } else if (currentValue.direction === "R") {
                currentModifier = -1
            }
        }
    } else if (dimension === "vertical") {
        if (previousModifier === +1) {
            if (currentValue.direction === "L") {
                currentModifier = +1
            } else if (currentValue.direction === "R") {
                currentModifier = -1
            }
        } else if (previousModifier === -1) {
            if (currentValue.direction === "L") {
                currentModifier = -1
            } else if (currentValue.direction === "R") {
                currentModifier = +1
            }
        }
    }
    return [...result, {
        modifier: currentModifier,
        amount: currentValue.amount,
    }]
}

const transformed = parsed.reduce(findVector, [])

// Part 1
const sumVectors = (result, currentValue, index) => {
    if (index % 2 === 0) {
        return {
            x: result.x + currentValue.amount * currentValue.modifier,
            y: result.y,
        }
    } else {
        return {
            x: result.x,
            y: result.y + currentValue.amount * currentValue.modifier,
        }
    }
}
const summed = transformed.reduce(sumVectors, { x: 0, y: 0 })
console.log('summed: ', summed)
const result = Math.abs(summed.x) + Math.abs(summed.y)
console.log('result: ', result)

// Part 2
const hash = location => `${location.x}/${location.y}`
const visitedLocations = new Set()
let currentLocation = { x: 0, y: 0 }
visitedLocations.add(hash(currentLocation))
transformed.forEach((vector, index) => {
    if (index % 2 === 0) {
        Array(vector.amount).fill(1).forEach(() => {
            currentLocation.x += 1 * vector.modifier
            const newHash = hash(currentLocation)
            if (visitedLocations.has(newHash)) {
                console.log(currentLocation)
                throw currentLocation
            }
            visitedLocations.add(newHash)
        })
    } else {
        Array(vector.amount).fill(1).forEach(() => {
            currentLocation.y += 1 * vector.modifier
            const newHash = hash(currentLocation)
            if (visitedLocations.has(newHash)) {
                console.log(currentLocation)
                throw currentLocation
            }
            visitedLocations.add(newHash)
        })
    }

})
