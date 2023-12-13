const { readFile } = require("../../common/io.js")
const { zip } = require("../../common/util.js")

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
        // arrangement: unfoldedArrangement,
        // groups: unfoldedGroups.split(",").map(Number),
        arrangement,
        groups: groups.split(",").map(Number),
    }
})
console.log('springs:', springs)

const withCache = (fn) => {
    const cache = new Map()
    return (...args) => {
        const key = JSON.stringify(args)
        if (cache.has(key)) {
            return cache.get(key)
        }
        const result = fn(...args)
        cache.set(key, result)
        return result
    }
}

const getGroups = (arrangement) => {
    const earlyGroups = [...arrangement.matchAll(/(\#)\1*/g)]
        .map(regexMatch => regexMatch[0].length)
    return earlyGroups
}

const charsLessThanOrEqualTo = (arrangement, group) => {
    return (arrangement.match(/#/g) || []).length <= group.reduce((a, b) => a + b)
}

const amountOfGroupsLessThanOrEqualTo = (arrangement, groups) => {
    const ifAllHash = arrangement.replaceAll("?", "#")
    const ifAllHashGroups = getGroups(ifAllHash)
    return ifAllHashGroups.length <= groups.length
}

const firstGroupLTE = (arrangement, groups) => {
    const firstGroup = getGroups(arrangement)[0]
    return firstGroup <= groups[0]
}

const ENABLE_DEBUG = true
const debug = (...args) => {
    if (ENABLE_DEBUG) console.log(...args)
}

const isStillPossible = (arrangement, groups) => {
    const a = firstGroupLTE(arrangement, groups)
    debug('a:', a)
    return a
}

const replaceAt = (string, index, replacement) => {
    return string.substring(0, index) + replacement + string.substring(index + 1)
}

const simplify = ({ arrangement, groups }) => {
    let previousArrangement = arrangement
    let newArrangement = null
    while (previousArrangement !== newArrangement) {
        newArrangement = previousArrangement
        for (let index = 0; index < newArrangement.length; index++) {
            if (newArrangement[index] === "?") {
                {
                    debug("==================")
                    const ifHash = replaceAt(newArrangement, index, "#")
                    const possibleIfHash = isStillPossible(ifHash, groups)
                    debug('ifHash:', ifHash)
                    debug('possibleIfHash:', possibleIfHash)
                    debug("==================")
                    // If a hash doesn't work, it must be a dot
                    // Simplify the arrangement and keep going
                    if (!possibleIfHash) newArrangement = replaceAt(newArrangement, index, ".")
                }
            }
        }
        for (let index = 0; index < newArrangement.length; index++) {
            if (newArrangement[index] === "?") {
                debug("==================")
                const ifDot = replaceAt(newArrangement, index, ".")
                const possibleIfDot = isStillPossible(ifDot, groups)
                debug('ifDot:', ifDot)
                debug('possibleIfDot:', possibleIfDot)
                debug("==================")
                // If a dot doesn't work, it must be a hash
                // Simplify the arrangement and keep going
                if (!possibleIfDot) newArrangement = replaceAt(newArrangement, index, "#")
            }
            return { arrangement, simplified: newArrangement, groups }
        }
    }
}

const simplifiedSprings = springs.map(simplify)
console.log('simplifiedSprings:', simplifiedSprings)
