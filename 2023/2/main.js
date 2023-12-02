const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")

const games = parsed.map(line => ({
    id: parseInt(line.split(":")[0].replace("Game ", "")),
    outcomes: line.split(":")[1].split(";").map(outcome => outcome.trim()),
}))
    .map(({ outcomes, ...other }) => ({
        ...other,
        outcomes: outcomes.map(outcome => ({
            red: parseInt(/(\d*) red/.exec(outcome)),
            blue: parseInt(/(\d*) blue/.exec(outcome)),
            green: parseInt(/(\d*) green/.exec(outcome)),
        }))
    }))
    .map(({ outcomes, ...other }) => ({
        ...other,
        outcomes: outcomes.map(outcome => ({
            red: outcome.red || 0,
            blue: outcome.blue || 0,
            green: outcome.green || 0,
        }))
    }))
games.forEach(game => console.log(game))

maxRed = 12
maxGreen = 13
maxBlue = 14

const possibleGames = games.filter(game => (
    game.outcomes.every(outcome => (
        outcome.red <= maxRed &&
        outcome.green <= maxGreen &&
        outcome.blue <= maxBlue
    ))
))
console.log('possibleGames:', possibleGames)

const sumOfIds = possibleGames.reduce((acc, game) => acc + game.id, 0)
console.log('sumOfIds:', sumOfIds)

const possibilities = games.map(({ outcomes, ...other }) => ({
    ...other,
    outcomes,
    minimumColors: {
        red: Math.max(...outcomes.map(outcome => outcome.red)),
        green: Math.max(...outcomes.map(outcome => outcome.green)),
        blue: Math.max(...outcomes.map(outcome => outcome.blue)),
    },
}))

console.log('possibilities:', possibilities)

powers = possibilities.map(({ minimumColors }) => minimumColors.red * minimumColors.green * minimumColors.blue)
console.log('powers:', powers)
const sumOfPowers = powers.reduce((acc, power) => acc + power, 0)
console.log('sumOfPowers:', sumOfPowers)
