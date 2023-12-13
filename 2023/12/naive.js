const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")
// console.log('parsed:', parsed)

const springs = parsed.map((line) => {
    const split = line.split(" ")
    const arrangement = split[0]
    const groups = split[1]
    const unfoldedArrangement = (arrangement + "?").repeat(5).slice(0, -1)
    const unfoldedGroups = (groups + ",").repeat(5).slice(0, -1)
    return {
        arrangement: unfoldedArrangement,
        groups: unfoldedGroups.split(",").map(Number),
    }
})
console.log('springs:', springs)

const permutations = (list, maxLen) => {
    // Copy initial values as arrays
    var perm = list.map(function (val) {
        return [val]
    })
    // Our permutation generator
    var generate = function (perm, maxLen, currLen) {
        // Reached desired length
        if (currLen === maxLen) {
            return perm
        }
        // For each existing permutation
        for (var i = 0, len = perm.length; i < len; i++) {
            var currPerm = perm.shift()
            // Create new permutation
            for (var k = 0; k < list.length; k++) {
                perm.push(currPerm.concat(list[k]))
            }
        }
        // Recurse
        return generate(perm, maxLen, currLen + 1)
    }
    // Start with size 1 because of initial values
    return generate(perm, maxLen, 1)
}

const hasValidGroups = (arrangement, groups) => {
    const brokenSpringRegex = /(\#)\1*/g
    const brokenGroups = [...arrangement.matchAll(brokenSpringRegex)]
        .map(regexMatch => regexMatch[0].length)
    return brokenGroups.join("-") === groups.join("-")
}

// const test = hasValidGroups("#.#", [1, 1])
// console.log('test:', test)

const earlyHasValidGroups = (partialArrangement, groups) => {
    const firstQuestionMark = partialArrangement.indexOf("?")
    let filledArrangement = partialArrangement.substring(0, firstQuestionMark)
    while (filledArrangement.at(-1) === "#") {
        filledArrangement = filledArrangement.slice(0, -1)
    }
    const brokenSpringRegex = /(\#)\1*/g
    const brokenGroups = [...filledArrangement.matchAll(brokenSpringRegex)]
        .map(regexMatch => regexMatch[0].length)
    return brokenGroups.join("-") === groups.slice(0, brokenGroups.length).join("-")
}
const testTwo = earlyHasValidGroups("#.#.???", [1, 1, 3])
console.log('testTwo:', testTwo)

const permutationMap = {}
const largestUnknown = "?????????????????"
for (let i = 1; i <= largestUnknown.length; i++) {
    permutationMap[i] = permutations([".", "#"], i).map((permutation) => permutation.join(""))
}
console.log("calculated permutation map")

const possibilities = springs.map(({ arrangement, groups }) => {
    const flatOptions = [arrangement]
    const unknownRegex = /(\?)\1*/g
    while (flatOptions.some(option => option.includes("?"))) {
        // console.log("=====================================")
        // console.log('flatOptions:', flatOptions)
        // console.log("=====================================")
        option = flatOptions.shift()
        const match = option.match(unknownRegex)[0]
        const length = match.length
        const permutations = permutationMap[length]
        permutations.forEach((permutation) => {
            const newOption = option.replace(match, permutation)
            // console.log("=====================================")
            // console.log('newOption:', newOption)
            // console.log('groups:', groups)
            // console.log('earlyHasValidGroups(newOption, groups):', earlyHasValidGroups(newOption, groups))
            if (earlyHasValidGroups(newOption, groups)) {
                flatOptions.push(newOption)
            }
            // console.log("=====================================")
        })
    }
    return flatOptions

})
// console.log('possibilities:', possibilities)

const validPossibilities = possibilities.map((possibilities, i) => {
    return possibilities.filter((possibility) => hasValidGroups(possibility, springs[i].groups))
})
// console.log('validPossibilities:', validPossibilities)

const sumOfPossibilities = validPossibilities
    .map((possibilities) => possibilities.length)
    .reduce((a, b) => a + b)
console.log('sumOfPossibilities:', sumOfPossibilities)
