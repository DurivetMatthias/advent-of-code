const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")
function factorialize(num) {
    if (num < 0)
        return -1;
    else if (num == 0)
        return 1;
    else {
        return (num * factorialize(num - 1));
    }
}

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
const initialRobots = {
    ore: 1,
    clay: 0,
    obsidian: 0,
    geode: 0
}
const types = Object.keys(initialRobots).reverse()
const initialResources = {
    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0
}

const encodeState = ({ time, resources, robots, openedGeodes }) => {
    return [
        Object.entries(resources).map(pair => pair.join(":")).join("&"),
        Object.entries(robots).map(pair => pair.join(":")).join("&"),
        openedGeodes,
        time,
    ].join("-")
}

const isStrictlyBetter = (main, other) => {
    const strictlyBetterResources = Object.entries(main.resources).every(([type, amount]) => other.resources[type] <= amount)
    const strictlyBetterRobots = Object.entries(main.robots).every(([type, amount]) => other.robots[type] <= amount)
    const strictlyEqualResources = Object.entries(main.resources).every(([type, amount]) => other.resources[type] === amount)
    const strictlyEqualRobots = Object.entries(main.resources).every(([type, amount]) => other.resources[type] === amount)
    const strictlyEqual = strictlyEqualResources && strictlyEqualRobots
    return strictlyBetterResources && strictlyBetterRobots && !strictlyEqual && main.openedGeodes >= other.openedGeodes
}

const findTimeToWait = (type, blueprint, robots, resources) => {
    const cost = blueprint[type]
    const waitTimes = []
    Object.keys(cost).forEach(costType => {
        if (robots[costType] === 0) {
            waitTimes.push(Infinity)
        } else if (resources[costType] >= cost[costType]) {
            waitTimes.push(0)
        } else {
            waitTimes.push(
                Math.ceil((cost[costType] - resources[costType]) / robots[costType])
            )
        }
    })
    return Math.max(...waitTimes)
}

const explore = (blueprint, timeLimit, targetRobots) => {
    let maxOpenedGeodes = 0
    const cache = new Set()
    const bestNodes = {}
    range(timeLimit + 1).forEach(t => bestNodes[t] = [])

    const queue = [{
        robots: { ...initialRobots },
        resources: { ...initialResources },
        openedGeodes: 0,
        time: 0,
        history: [],
    }]
    let lastQueueSize = 0
    while (queue.length > 0) {
        const state = queue.sort((a, b) => a.time - b.time).shift()
        const { robots, resources, openedGeodes, time, history } = state

        // if (Math.floor(queue.length / 1000) !== Math.floor(lastQueueSize / 1000)) {
        //     console.log('queue.length: ', queue.length)
        //     console.log('time: ', time)
        //     console.log('ore: ', robots.ore)
        //     console.log('clay: ', robots.clay)
        //     console.log('obsidian: ', robots.obsidian)
        //     console.log('geode: ', robots.geode)
        //     console.log()
        //     lastQueueSize = queue.length
        // }

        const encoded = encodeState(state)
        if (cache.has(encoded)) continue
        cache.add(encoded)

        const isNotOptimal = bestNodes[time].some(otherState => isStrictlyBetter(otherState, state))
        if (isNotOptimal) continue
        bestNodes[time].push({ ...state })

        const timeLeft = timeLimit - time
        // If no more robots are made
        const resourceForecast = Object.entries(resources)
            .reduce((result, [type, amount]) => ({
                ...result,
                [type]: amount + robots[type] * timeLeft,
            }), {})
        maxOpenedGeodes = Math.max(maxOpenedGeodes, resourceForecast.geode)

        const maxPotential = resourceForecast.geode + factorialize(timeLeft)
        if (maxPotential < maxOpenedGeodes) continue

        let options = []
        const relevantTypes = types.filter(t => t !== "geode")
        relevantTypes.forEach(type => {
            if (robots[type] < targetRobots[type]) options.push(type)
        })
        options = [...options, "geode"]

        options.forEach(newRobotType => {
            const timeToWait = findTimeToWait(newRobotType, blueprint, robots, resources) + 1
            const newTime = time + timeToWait
            if (newTime <= timeLimit) {
                const newRobots = {
                    ...robots,
                    [newRobotType]: robots[newRobotType] + 1,
                }
                const newResources = Object.entries(resources)
                    .reduce((result, [type, amount]) => {
                        let cost
                        if (Object.keys(blueprint[newRobotType]).includes(type)) {
                            cost = blueprint[newRobotType][type]
                        } else {
                            cost = 0
                        }
                        return {
                            ...result,
                            [type]: amount - cost + robots[type] * timeToWait
                        }
                    }, {})
                queue.push({
                    robots: newRobots,
                    resources: newResources,
                    openedGeodes: openedGeodes + robots.geode * timeToWait,
                    time: newTime,
                    history: [...history, newRobotType],
                })
            }
        })
    }

    return maxOpenedGeodes
}

// Part one
// const blueprints = parsed.map(blueprint => {
//     const maxGeode = explore(blueprint, 24)
//     return ({
//         id: blueprint.id,
//         geodes: maxGeode,
//     })
// })
// console.log('blueprints: ', blueprints)
// const qualityLevels = blueprints.map(({ id, geodes }) => id * geodes)
// console.log('qualityLevels: ', qualityLevels)
// const total = qualityLevels.reduce((total, n) => total + n)
// console.log('total: ', total)

// Part two
console.log('parsed: ', parsed)
const maxRobots = [
    {
        ore: 4,
        clay: 14,
        obsidian: 7,
    }, {
        ore: 3,
        clay: 8,
        obsidian: 12,
    },
]
const minRobots = [
    {
        ore: 2,
        clay: 7,
        obsidian: 3,
    }, {
        ore: 2,
        clay: 4,
        obsidian: 6,
    },
]
const rangeFromTo = (from, to) => range(to - from + 1).map(n => n + from)
const blueprints = parsed.slice(0, 1).map((blueprint, bIndex) => {
    const min = minRobots[bIndex]
    const max = maxRobots[bIndex]
    const options = rangeFromTo(min.ore, max.ore)
        .map(ore => {
            return rangeFromTo(min.clay, max.clay)
                .map(clay => {
                    return range(min.obsidian, max.obsidian)
                        .map(obsidian => ({ ore, clay, obsidian }))
                })
        }).flat(3)
    let maxGeode = 0
    options.forEach((option, optionIndex) => {
        console.log(`${optionIndex}/${options.length}`)
        const geodes = explore(blueprint, 32, option)
        if (geodes > maxGeode) maxGeode = geodes
    })
    console.log('maxGeode: ', bIndex, maxGeode)
    return ({
        id: blueprint.id,
        geodes: maxGeode,
    })
})
console.log('blueprints: ', blueprints)
const total = blueprints.map(({ geodes }) => geodes).reduce((total, n) => total * n)
console.log('total: ', total)
