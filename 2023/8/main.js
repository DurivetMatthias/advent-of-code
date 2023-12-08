const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)

const [rawInstructions, rawNodes] = parsed.split("\n\n")
const instructions = rawInstructions.split("").map(instruction => instruction === "L" ? "left" : "right")
// console.log(instructions)
const nodes = rawNodes.split("\n").map(line => {
    const cleanLine = line.replace("= ", "").replace("(", "").replace(",", "").replace(")", "")
    const [node, left, right] = cleanLine.split(" ")
    return { node, left, right }
})

const nodesMap = nodes
    .reduce((acc, { node, left, right }) => {
        acc[node] = { left, right }
        return acc
    }, {})


// console.log(nodes)

const followInstructionsRepeating = (instructions, nodes) => {
    let steps = 0
    let currentNode = "AAA"
    while (currentNode !== "ZZZ") {
        const node = nodesMap[currentNode]
        const instruction = instructions[steps % instructions.length]
        currentNode = node[instruction]
        steps++
    }
    return steps
}

// const amountOfSteps = followInstructionsRepeating(instructions, nodes)
// console.log(amountOfSteps)

const gcd = (a, b) => {
    if (b === 0) {
        return a
    }
    return gcd(b, a % b)
}
const smallestCommonMultiple = (a, b) => {
    return (a * b) / gcd(a, b)
}

const followGhostInstructions = (instructions, nodes) => {
    let steps = 0
    let currentNodes = nodes.map(({ node }) => node).filter(node => node[2] === "A")
    console.log('currentNodes.length:', currentNodes.length)
    const zInterval = new Map()
    console.log('zInterval.size < currentNodes.length:', zInterval.size < currentNodes.length)
    console.log('zInterval.size:', zInterval.size)
    console.log('currentNodes.length:', currentNodes.length)
    while (zInterval.size < currentNodes.length) {
        const instruction = instructions[steps % instructions.length]
        currentNodes = currentNodes.map(node => nodesMap[node][instruction])
        steps++
        currentNodes.forEach(node => {
            if (node[2] === "Z") {
                const interval = steps - (zInterval.get(node) || 0)
                zInterval.set(node, interval)
                // console.log('zInterval:', zInterval)
            }
        })
    }
    console.log('zInterval:', zInterval)
    const smallestCommonMultipleOfIntervals = [...zInterval.values()].reduce(smallestCommonMultiple)
    return smallestCommonMultipleOfIntervals

}

const amountOfStepsForGhosts = followGhostInstructions(instructions, nodes)
console.log(amountOfStepsForGhosts)

console.log('smallestCommonMultiple(2, 3):', smallestCommonMultiple(2, 3))
console.log('gcd(2, 6):', gcd(2, 6))
console.log('gcd(2, 3):', gcd(2, 3))
