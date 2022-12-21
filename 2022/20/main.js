const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => parseInt(line))
    .map(n => n * 811589153)
// .slice(1130, 1141)
// console.log('parsed: ', parsed)

const linkedCircularList = parsed.map(value => ({
    value
}))
linkedCircularList.forEach((item, index) => {
    const next = linkedCircularList[(index + 1) % parsed.length]
    const previous = linkedCircularList[(index - 1 + parsed.length) % parsed.length]
    item.next = next
    item.previous = previous
})
const getNextX = (x, item) => {
    if (x === 0) return item
    return getNextX((x - 1) % (parsed.length - 1), item.next)
}
const getPreviousX = (x, item) => {
    if (x === 0) return item
    return getPreviousX((x - 1) % (parsed.length - 1), item.previous)
}
const getNextXRaw = (x, item) => {
    if (x === 0) return item
    return getNextX(x - 1, item.next)
}
const getPreviousXRaw = (x, item) => {
    if (x === 0) return item
    return getPreviousX(x - 1, item.previous)
}

const printValues = () => {
    const zeroItem = linkedCircularList.filter(i => i.value === 0)[0]
    const newOrder = range(parsed.length).map(offset => getNextX(offset, zeroItem)).map(i => i.value)
    console.log(newOrder.join(" "))
}

// Figure out how multiple loops work

const mixNumbers = () => {
    linkedCircularList.forEach(item => {
        // console.log('item.value % parsed.length: ', item.value % parsed.length)
        if (item.value % parsed.length !== 0) {
            let newPrevious
            let newNext
            const oldPrevious = item.previous
            const oldNext = item.next
            oldPrevious.next = oldNext
            oldNext.previous = oldPrevious
            if (item.value >= 0) {
                newPrevious = getNextX(item.value, item)
                newNext = getNextX(item.value + 1, item)
            } else {
                newPrevious = getPreviousX(-item.value + 1, item)
                newNext = getPreviousX(-item.value, item)
            }
            item.next = newNext
            item.previous = newPrevious
            newPrevious.next = item
            newNext.previous = item
            // console.log(item.value, "moves between", item.previous.value, "and", item.next.value)
        } else {
            // console.log(item.value, "does not move")
        }
        // printValues()
    })
}
range(10).forEach(() => {
    mixNumbers()
})

const zero = linkedCircularList.filter(i => i.value === 0)[0]
const thousand = getNextXRaw(1000 % parsed.length, zero)
const twoThousand = getNextXRaw(2000 % parsed.length, zero)
const threeThousand = getNextXRaw(3000 % parsed.length, zero)
console.log('thousand: ', thousand.value)
console.log('twoThousand: ', twoThousand.value)
console.log('threeThousand: ', threeThousand.value)
const total = thousand.value + twoThousand.value + threeThousand.value
console.log('total: ', total)
