const { time } = require("console")
const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => {
        const regex = new RegExp("Blueprint (\\d+): Each ore robot costs (\\d+) ore. Each clay robot costs (\\d+) ore. Each obsidian robot costs (\\d+) ore and (\\d+) clay. Each geode robot costs (\\d+) ore and (\\d+) obsidian.")
        const [id, oreOre, clayOre, obsidianOre, obsidianClay, geodeOre, geodeObsidian] = line.match(regex).slice(1, 8).map(n => parseInt(n))
        return {
            id,
            ore: {
                ore: oreOre,
            },
            clay: {
                ore: clayOre,
            },
            obsidian: {
                ore: obsidianOre,
                clay: obsidianClay
            },
            geode: {
                ore: geodeOre,
                obsidian: geodeObsidian,
            },
        }
    })
// console.log('parsed: ', parsed)
const initialRobots = { ore: 1, clay: 0, obsidian: 0, geode: 0 }
const types = Object.keys(initialRobots).reverse()
const initialResources = { ore: 0, clay: 0, obsidian: 0, geode: 0 }
const timeLimit = 32

const historyToMakeMineral = {}
range(timeLimit).slice(1).forEach(ore => {
    const index = timeLimit - ore - 1
    const history = new Array(timeLimit).fill(null)
    history[index] = "mineral"
    historyToMakeMineral[ore] = history
})
console.log('historyToMakeMineral: ', historyToMakeMineral)
