const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const getGameOutcome = {
    A: {
        X: 3,
        Y: 6,
        Z: 0,
    },
    B: {
        X: 0,
        Y: 3,
        Z: 6,
    },
    C: {
        X: 6,
        Y: 0,
        Z: 3,
    },
}

const getShapeScore = {
    X: 1,
    Y: 2,
    Z: 3,
}

const getWinningShape = {
    A: {
        X: "Z",
        Y: "X",
        Z: "Y",
    },
    B: {
        X: "X",
        Y: "Y",
        Z: "Z",
    },
    C: {
        X: "Y",
        Y: "Z",
        Z: "X",
    },
}

const parsed = data
    .split("\n")
    .map(line => ({
        opponent: line[0],
        me: line[2],
    }))
    .map(({ opponent, me }) => {
        return {
            opponent,
            me: getWinningShape[opponent][me],
        }
    })
    .map(({ opponent, me }) => {
        return {
            opponent,
            me,
            gameScore: getGameOutcome[opponent][me]
        }
    })
    .map(({ me, ...other }) => {
        return {
            ...other,
            me,
            shapeScore: getShapeScore[me]
        }
    })
    .map(({ gameScore, shapeScore, ...other }) => {
        return {
            ...other,
            gameScore,
            shapeScore,
            totalScore: gameScore + shapeScore
        }
    })
console.log('parsed: ', parsed)

const totalScore = parsed.reduce((total, element) => {
    return total + element.totalScore
}, 0)
console.log('totalScore: ', totalScore)
