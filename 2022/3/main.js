const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const letterToNumber = letter => {
    const lowerCaseScore = letter.charCodeAt(0) - 96
    if (lowerCaseScore < 1) return lowerCaseScore + (26 * 2) + 6
    return lowerCaseScore
}
const numberToLetter = number => String.fromCharCode(97 + number)

const parsed = data
    .split("\n")
    // .map(line => {
    //     const halfLength = line.length / 2
    //     const compartmentOne = line.slice(0, halfLength)
    //     const compartmentTwo = line.slice(halfLength)
    //     return {
    //         compartmentOne,
    //         compartmentTwo,
    //     }
    // })
    // .map(({ compartmentOne, compartmentTwo }) => {
    //     return {
    //         duplicate: compartmentOne.split("").filter(letter => compartmentTwo.includes(letter))[0]
    //     }
    // })
    // .map(({ duplicate }) => {
    //     return {
    //         duplicate,
    //         priority: letterToNumber(duplicate)
    //     }
    // })
    .reduce((result, line, index) => {
        console.log('index: ', index)
        if (index % 3 === 0) return [...result, [line]]
        else return [...result.slice(0, -1), [...result.slice(-1)[0], line]]
    }, [])
    .map(group => {
        return {
            badge: group[0].split("").filter(letter => group[1].includes(letter) && group[2].includes(letter))[0]
        }
    })
    .map(({ badge }) => {
        return {
            badge,
            priority: letterToNumber(badge)
        }
    })
console.log('parsed: ', parsed)

const sumOfPriorities = parsed.reduce((total, value) => {
    return total + value.priority
}, 0)
console.log('sumOfPriorities: ', sumOfPriorities)
