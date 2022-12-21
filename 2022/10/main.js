const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")
const NOOP = "NOOP"
const ADDX = "ADDX"

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => {
        if (line === "noop") {
            return {
                type: NOOP
            }
        } else {
            return {
                type: ADDX,
                v: parseInt(line.split(" ")[1])
            }
        }
    })

// console.log('parsed: ', parsed)

const executeProgram = (instructions, interestingCycles = [20, 60, 100, 140, 180, 220]) => {
    let cycle = 1
    let x = 1
    const signalStrengths = {}
    instructions.forEach(instruction => {
        if (instruction.type === NOOP) {
            signalStrengths[cycle] = x
            cycle += 1
            signalStrengths[cycle] = x
        }
        if (instruction.type === ADDX) {
            signalStrengths[cycle] = x
            signalStrengths[cycle + 1] = x
            cycle += 2
            x += instruction.v
            signalStrengths[cycle] = x
        }
    })
    return signalStrengths
}
const signalStrengths = executeProgram(parsed)
// console.log('signalStrengths: ', signalStrengths)

// const summed = Object.values(signalStrengths).filter((x, i) => [20, 60, 100, 140, 180, 220].includes(i + 1)).reduce((total, n) => total + n, 0)
// console.log('summed: ', summed)

const pixels = range(240)
    .map(n => n + 1)
    .map(n => {
        const x = signalStrengths[n]
        const breakpoints = [40, 80, 120, 160, 200, 240]
        const offset = breakpoints
            .filter(b => n <= b)[0] - 39
        if (n === x - 1 + offset || n === x + offset || n === x + 1 + offset) {
            return "#"
        } else return " "
    })
    .join("")
const screen = [
    pixels.slice(0, 40),
    pixels.slice(40, 80),
    pixels.slice(80, 120),
    pixels.slice(120, 160),
    pixels.slice(160, 200),
    pixels.slice(200, 240),
]

console.log('screen: ', screen)
const part2 = "EHPZPJGL"
