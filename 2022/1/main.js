const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n\n")
    .map(p => p
        .split("\n")
        .map(calories => parseInt(calories))
    )
    .map(team => ({
        total: team.reduce((sum, el) => sum + el, 0),
        original: team,
    }))
console.log('parsed: ', parsed)

const highestTotal = parsed.sort((a, b) => b.total - a.total)[0]
console.log('highestTotal: ', highestTotal)

const top3 = parsed
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
    .reduce((sum, el) => sum + el.total, 0)
console.log('top3: ', top3)
