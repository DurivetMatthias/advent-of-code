const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")

const parsed = readFile(__dirname)
    .split("\n\n")
    .map(paragraph => paragraph
        .split("\n")
        .map(line => {
            if (line.includes("Monkey ")) {
                const id = line.replace("Monkey ", "").replace(":", "")
                return { id }
            } else if (line.includes("Starting items: ")) {
                const items = line.replace("Starting items: ", "")
                    .split(", ")
                    .map(item => BigInt(item))
                return { items }
            } else if (line.includes("Operation: ")) {
                const operation = line.replace("Operation: new = ", "")
                return { operation }
            } else if (line.includes("Test: ")) {
                const test = BigInt(line.replace("Test: divisible by ", ""))
                return { test }
            } else if (line.includes("If true: ")) {
                const ifTrue = line.replace("If true: throw to monkey ", "")
                return { ifTrue }
            } else if (line.includes("If false: ")) {
                const ifFalse = line.replace("If false: throw to monkey ", "")
                return { ifFalse }
            }
        })
        .reduce((result, line) => {
            return {
                ...result,
                ...line,
            }
        }, {})
    )

// console.log('parsed: ', parsed)

const testDivisibility = (number, divisor) => {
    if (number < Number.MAX_VALUE) return parseInt(number) % parseInt(divisor) == 0
    else if (divisor == 13) {
        // Subtract 9 times the last digit from the rest.
        const lastDigit = BigInt(number.toString().slice(-1))
        const rest = BigInt(number.toString().slice(0, -1))
        return testDivisibility(rest - (9n * lastDigit), divisor)
    } else if (divisor == 17) {
        // Subtract 5 times the last digit from the rest.
        const lastDigit = BigInt(number.toString().slice(-1))
        const rest = BigInt(number.toString().slice(0, -1))
        return testDivisibility(rest - (5n * lastDigit), divisor)
    } else if (divisor == 19) {
        // Add twice the last digit to the rest.
        const lastDigit = BigInt(number.toString().slice(-1))
        const rest = BigInt(number.toString().slice(0, -1))
        return testDivisibility(rest + (2n * lastDigit), divisor)
    } else if (divisor == 23) {
        // Add 7 times the last digit to the rest.
        const lastDigit = BigInt(number.toString().slice(-1))
        const rest = BigInt(number.toString().slice(0, -1))
        return testDivisibility(rest + (7n * lastDigit), divisor)
    }
}

const test13 = range(1000).map(i => {
    const normal = i % 13 === 0
    const alternative = testDivisibility(i, 13)
    return normal === alternative
}).every(x => x)
console.log('test: ', test13)

const test17 = range(1000).map(i => {
    const normal = i % 17 === 0
    const alternative = testDivisibility(i, 17)
    return normal === alternative
}).every(x => x)
console.log('test: ', test17)

const test19 = range(1000).map(i => {
    const normal = i % 19 === 0
    const alternative = testDivisibility(i, 19)
    return normal === alternative
}).every(x => x)
console.log('test: ', test19)

const test23 = range(1000).map(i => {
    const normal = i % 23 === 0
    const alternative = testDivisibility(i, 23)
    return normal === alternative
}).every(x => x)
console.log('test: ', test23)

const simulateRounds = (monkeys, totalRounds) => {
    // const liveMoneys = JSON.parse(JSON.stringify(monkeys))
    const liveMoneys = [...monkeys]
    range(totalRounds).map(n => n + 1).forEach(round => {
        if (round % 100 === 0) console.log(round)
        liveMoneys.map(monkey => {
            monkey.items.forEach(item => {
                const operation = ([a, operation, b]) => {
                    if (operation === "+") {
                        // return a + b
                        return (a + b) % parsed.map(x => x.test).reduce((total, x) => total * x)
                    } else {
                        return (a * b) % parsed.map(x => x.test).reduce((total, x) => total * x)
                    }
                }
                const arguments = monkey.operation
                    .replaceAll("old", item)
                    .split(" ")
                    .map(x => {
                        if (isNaN(x)) return x
                        else return BigInt(x)
                    })
                let worryLevel = operation(arguments)
                // worryLevel = Math.floor(worryLevel / 3)

                // const testResult = worryLevel % monkey.test == 0
                const testResult = testDivisibility(worryLevel, monkey.test)
                if (testResult) {
                    liveMoneys[monkey.ifTrue].items.push(worryLevel)
                } else {
                    liveMoneys[monkey.ifFalse].items.push(worryLevel)
                }
                if (monkey.itemsInspected) monkey.itemsInspected += 1
                else monkey.itemsInspected = 1
            })
            monkey.items = []
        })
    })
    return liveMoneys
}
const result = simulateRounds(parsed, 10000)
console.log('result: ', result)

const monkeyBusiness = result
    .map(m => m.itemsInspected)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((total, n) => total * n)
console.log('monkeyBusiness: ', monkeyBusiness)
