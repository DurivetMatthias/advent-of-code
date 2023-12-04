const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")

const cards = parsed
    .map(line => ({
        cardNumber: Number(line.split(": ")[0].replace("Card ", "")),
        remainder: line.split(": ")[1],
    }))
    .map(({ remainder, ...other }) => ({
        ...other,
        winningNumbers: remainder.split(" | ")[0].split(" ").map(Number).filter(x => x > 0),
        numbers: remainder.split(" | ")[1].replaceAll("  ", " ").split(" ").map(Number).filter(x => x > 0),
    }))

// cards.forEach(card => console.log(card))

const scoredCards = cards.map(card => {
    const matches = card.numbers.filter(number => card.winningNumbers.includes(number)).length
    let score = 0
    if (matches > 0) score = 2 ** (matches - 1)
    return {
        ...card,
        matches,
        score,
    }
})

// scoredCards.forEach(card => console.log(card))
const totalScore = scoredCards.map(x => x.score).reduce((a, b) => a + b, 0)
console.log('totalScore:', totalScore)

// ------
// Part 2
// ------

const reversedCards = scoredCards.slice().reverse()
const recursiveCards = []
for (let i = 0; i < reversedCards.length; i++) {
    const card = reversedCards[i]
    const winsCopiesOf = recursiveCards.slice(0, card.matches)

    const recursiveScore = card.matches + winsCopiesOf.map(x => x.recursiveScore).reduce((a, b) => a + b, 0)
    recursiveCards.unshift({
        ...card,
        recursiveScore
    })
}
// recursiveCards.forEach(card => console.log(card))
const recursiveTotalScore = recursiveCards.map(x => x.recursiveScore).reduce((a, b) => a + b, 0) + cards.length
console.log('recursiveTotalScore:', recursiveTotalScore)
