const { readFile } = require("../../common/io.js")
const sum = array => array.reduce((total, value) => total + value, 0)

const splitMarker = "#"

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => {
        const [valve, flowRate, tunnels] = line
            .replace("Valve ", "")
            .replace(" has flow rate=", splitMarker)
            .replace("; tunnel leads to valve ", splitMarker)
            .replace("; tunnels lead to valves ", splitMarker)
            .split(splitMarker)
        return {
            valve,
            flowRate: parseInt(flowRate),
            tunnels: tunnels.split(", ")
        }
    })
// console.log('parsed: ', parsed)

const flowRates = parsed
    .reduce((result, node) => ({
        ...result,
        [node.valve]: node.flowRate,
    }), {})
// console.log('flowRates: ', flowRates)

const tunnels = parsed
    .reduce((result, node) => ({
        ...result,
        [node.valve]: node.tunnels,
    }), {})
// console.log('tunnels: ', tunnels)

const allNodes = parsed.map(node => node.valve)
// console.log('allNodes: ', allNodes)

const calculateTimeToOpen = initialNode => {
    const timeToOpenSingle = 1
    const queue = [{ ...(parsed.filter(node => node.valve === initialNode)[0]), travelTime: 0 }]
    const timeToOpen = {}
    while (!allNodes.every(node => Boolean(timeToOpen[node]))) {
        const currentNode = queue.shift()
        if (!Boolean(timeToOpen[currentNode.valve])) timeToOpen[currentNode.valve] = currentNode.travelTime + timeToOpenSingle
        currentNode.tunnels.forEach(tunnel => {
            if (!Boolean(timeToOpen[tunnel])) {
                queue.push({ ...(parsed.filter(node => node.valve === tunnel)[0]), travelTime: currentNode.travelTime + 1 })
            }
        })
    }
    return timeToOpen
}
const timesToOpen = parsed
    .map(({ valve, flowRate, tunnels }) => {
        const timeToOpen = calculateTimeToOpen(valve)
        return {
            valve,
            flowRate,
            tunnels,
            timeToOpen,
        }
    })
    .reduce((result, node) => ({
        ...result,
        [node.valve]: node.timeToOpen,
    }), {})
// console.log('timesToOpen: ', timesToOpen)

const openValvesFlowRates = Object.entries(flowRates)
    .filter(([key, value]) => value > 0)
    .reduce((result, [key, value]) => ({
        ...result,
        [key]: value,
    }), {})
// console.log('openValvesFlowRates: ', openValvesFlowRates)

const dfsAllSinglePaths = (initialNode, timeLimit) => {
    const result = []
    const queue = [
        {
            currentNode: initialNode,
            time: 0,
            totalPressure: 0,
            history: [],
            path: [],
            flowRates: { ...openValvesFlowRates }
        }
    ]
    while (queue.length > 0) {
        const node = queue.pop()
        const { currentNode, time, totalPressure, history, path, flowRates } = node
        result.push(node)
        Object.keys(flowRates).forEach(targetNode => {
            const newTime = time + timesToOpen[currentNode][targetNode]
            const additionalPressure = Math.max(timeLimit - newTime, 0) * flowRates[targetNode]
            const newTotalPressure = totalPressure + additionalPressure
            const newFlowRates = { ...flowRates }
            delete newFlowRates[targetNode]
            const newHistory = [...history, additionalPressure]
            const newPath = [...path, targetNode]
            const newNode = {
                time: newTime,
                totalPressure: newTotalPressure,
                flowRates: newFlowRates,
                currentNode: targetNode,
                path: newPath,
                history: newHistory,
            }
            if (newTime < timeLimit) {
                queue.push(newNode)
            }
        })
    }
    return result
}
const allPaths = dfsAllSinglePaths("AA", 30)
    .sort((a, b) => b.totalPressure - a.totalPressure)

const mostPressure = allPaths[0].totalPressure
console.log('mostPressure: ', mostPressure)

const allSinglePaths = dfsAllSinglePaths("AA", 26)
    .sort((a, b) => b.totalPressure - a.totalPressure)

let highest = 0
allSinglePaths.forEach(a => {
    allSinglePaths.forEach(b => {
        if (a.path.every(aNode => !b.path.includes(aNode))) {
            const total = a.totalPressure + b.totalPressure
            if (total > highest) {
                highest = total
                console.log('mostDoublePressure: ', total)
            }
        }
    })
})
