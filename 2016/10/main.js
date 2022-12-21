const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n")
    .map(line => {
        let regex = new RegExp("value ([0-9]+) goes to bot ([0-9]+)")
        let match = line.match(regex)
        if (match) return {
            type: "single",
            bot: parseInt(match[2]),
            value: parseInt(match[1]),
        }

        const botTemplate = "bot [0-9]+"
        const outputTemplate = "output [0-9]+"
        regex = new RegExp(`(${botTemplate}) gives low to (${botTemplate}|${outputTemplate}) and high to (${botTemplate}|${outputTemplate})`)
        match = line.match(regex)
        if (match) return {
            type: "multi",
            bot: parseInt(match[1].replace("bot ", "")),
            low: {
                type: "single",
                value: null,
                bot: match[2].includes("bot") ? parseInt(match[2].replace("bot ", "")) : null,
                output: match[2].includes("output") ? parseInt(match[2].replace("output ", "")) : null,
            },
            high: {
                type: "single",
                value: null,
                bot: match[3].includes("bot") ? parseInt(match[3].replace("bot ", "")) : null,
                output: match[3].includes("output") ? parseInt(match[3].replace("output ", "")) : null,
            },
        }
    })
console.log('parsed: ', parsed)
