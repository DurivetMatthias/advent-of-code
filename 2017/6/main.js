const { readFile } = require("../../common/io.js")

const cache = new Set()
const encodeState = state => state.map(e => e.value).join(" ")

const parsed = readFile(__dirname)
    .split("\t")
    .map(line => parseInt(line))
    .map((n, i) => ({ index: i, value: n }))

console.log('parsed: ', parsed)

const balanceMemory = state => {
    let step = 0
    let activeState = [...state]
    let seenOnce = false
    let seenTwice = false
    while (!seenTwice) {
        const encoded = encodeState(activeState)
        if (seenOnce && !seenTwice && encoded === seenOnce.encoded) seenTwice = { step, encoded }
        if (!seenOnce && cache.has(encoded)) seenOnce = { step, encoded }
        cache.add(encoded)

        const chosenBank = activeState.sort((a, b) => b.value - a.value)[0]
        activeState.sort((a, b) => a.index - b.index)[0]

        const nextBank = (chosenBank.index + 1) % activeState.length
        const remainder = chosenBank.value % activeState.length
        const newBanks = [...activeState.slice(nextBank), ...activeState.slice(0, nextBank)]
            .map(({ value, index }, sortedIndex) => {
                let additionalAmount
                if (sortedIndex < remainder) {
                    additionalAmount = Math.ceil(chosenBank.value / activeState.length)
                } else {
                    additionalAmount = Math.floor(chosenBank.value / activeState.length)
                }
                let newValue
                if (index === chosenBank.index) {
                    newValue = 0 + additionalAmount
                } else {
                    newValue = value + additionalAmount
                }
                return { index, value: newValue }
            })

        step += 1
        activeState = newBanks
        activeState.sort((a, b) => a.index - b.index)[0]
    }
    console.log('step: ', step)
    console.log('seenOnce: ', seenOnce)
    console.log('seenTwice: ', seenTwice)
    const loopSize = seenTwice.step - seenOnce.step
    console.log('loopSize: ', loopSize)
}
balanceMemory(parsed)
