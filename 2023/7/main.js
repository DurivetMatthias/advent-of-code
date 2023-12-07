const { readFile, writeFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")

// console.log("parsed:", parsed)

const TYPE = {
    HIGH_CARD: 0,
    ONE_PAIR: 1,
    TWO_PAIR: 2,
    THREE_OF_A_KIND: 3,
    FULL_HOUSE: 4,
    FOUR_OF_A_KIND: 5,
    FIVE_OF_A_KIND: 6,
}

const determineRank = (labels) => {
    const labelCount = {
        "A": 0,
        "K": 0,
        "Q": 0,
        // "J": 0,
        "T": 0,
        "9": 0,
        "8": 0,
        "7": 0,
        "6": 0,
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
    }
    let amountOfJokers = 0
    labels.split("").forEach(label => {
        if (label !== "J") labelCount[label]++
        else amountOfJokers++
    })
    const sortedLabelCount = Object.values(labelCount).sort((a, b) => b - a)

    if (amountOfJokers === 0) {
        if (sortedLabelCount[0] === 5) return TYPE.FIVE_OF_A_KIND
        if (sortedLabelCount[0] === 4) return TYPE.FOUR_OF_A_KIND
        if (sortedLabelCount[0] === 3 && sortedLabelCount[1] == 2) return TYPE.FULL_HOUSE
        if (sortedLabelCount[0] === 3) return TYPE.THREE_OF_A_KIND
        if (sortedLabelCount[0] === 2 && sortedLabelCount[1] == 2) return TYPE.TWO_PAIR
        if (sortedLabelCount[0] === 2) return TYPE.ONE_PAIR
        if (sortedLabelCount[0] === 1) return TYPE.HIGH_CARD
    }

    if (amountOfJokers === 1) {
        if (sortedLabelCount[0] === 4) return TYPE.FIVE_OF_A_KIND
        if (sortedLabelCount[0] === 3) return TYPE.FOUR_OF_A_KIND
        if (sortedLabelCount[0] === 2 && sortedLabelCount[1] == 2) return TYPE.FULL_HOUSE
        if (sortedLabelCount[0] === 2) return TYPE.THREE_OF_A_KIND
        if (sortedLabelCount[0] === 1) return TYPE.ONE_PAIR
    }

    if (amountOfJokers === 2) {
        if (sortedLabelCount[0] === 3) return TYPE.FIVE_OF_A_KIND
        if (sortedLabelCount[0] === 2) return TYPE.FOUR_OF_A_KIND
        if (sortedLabelCount[0] === 1) return TYPE.THREE_OF_A_KIND
    }

    if (amountOfJokers === 3) {
        if (sortedLabelCount[0] === 2) return TYPE.FIVE_OF_A_KIND
        if (sortedLabelCount[0] === 1) return TYPE.FOUR_OF_A_KIND
    }

    if (amountOfJokers > 3) {
        return TYPE.FIVE_OF_A_KIND
    }
}

const hands = parsed.map(hand => {
    let [labels, bid] = hand.split(" ")
    bid = parseInt(bid)
    labels = labels
    const rank = determineRank(labels)
    return {
        labels,
        bid,
        rank,
    }
})

// console.log("hands:", hands)

const labelToRank = {
    "A": 14,
    "K": 13,
    "Q": 12,
    "J": 1,
    "T": 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
}

const compareHands = (a, b) => {
    if (a.rank > b.rank) return -1
    if (a.rank < b.rank) return 1
    for (let i = 0; i < a.labels.length; i++) {
        if (labelToRank[a.labels[i]] > labelToRank[b.labels[i]]) return -1
        if (labelToRank[a.labels[i]] < labelToRank[b.labels[i]]) return 1
    }
    return 0
}

const sortedHands = hands.sort(compareHands)
// console.log("sortedHands:", sortedHands)
// console.log(sortedHands.slice(-20))
file_path = "."
file_name = "debug.json"
data = JSON.stringify(sortedHands, null, 4)
writeFile(file_path, file_name, data)

const totalWinnings = sortedHands.map((hand, index) => {
    return hand.bid * (sortedHands.length - index)
}).reduce((a, b) => a + b, 0)
console.log("totalWinnings:", totalWinnings)
