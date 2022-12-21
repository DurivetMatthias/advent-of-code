const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")

const BEGIN = "BEGIN"
const WAKE = "WAKE"
const SLEEP = "SLEEP"

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => {
        const regex = new RegExp("\\[(\\d*)-(\\d*)-(\\d*) (\\d*):(\\d*)\\] (.*)")
        const result = line.match(regex)
        const [year, month, day, hour, minute] = result.slice(1, 6).map(n => parseInt(n))
        const event = result[6]
        return {
            year,
            month,
            day,
            hour,
            minute,
            timestamp: new Date(year, month, day, hour, minute, 0, 0),
            event,
            original: line,
        }
    })
    .map(({ event, ...other }) => {
        let action
        let id
        if (event === "wakes up") action = WAKE
        if (event === "falls asleep") action = SLEEP
        if (event.includes("begins shift")) action = BEGIN
        if (action === BEGIN) {
            const regex = RegExp("Guard #(\\d*) begins shift")
            const result = event.match(regex)
            id = parseInt(result[1])
        }
        return {
            action,
            id,
            ...other,
        }
    })
    .sort((a, b) => a.timestamp - b.timestamp)

// console.log('parsed: ', parsed)

let lastId
const events = parsed
    .map(({ id, ...other }) => {
        if (id) lastId = id
        return {
            id: lastId,
            ...other,
        }
    })
// console.log('events: ', events)

let sleepStart

const hoursAsleep = events
    .reduce((result, { id, action, timestamp }) => {
        if (action === SLEEP) sleepStart = timestamp
        if (action === WAKE) {
            const sleepTime = timestamp - sleepStart
            if (result[id]) result[id] += sleepTime
            else result[id] = sleepTime
        }
        return result
    }, {})
// console.log('hoursAsleep: ', hoursAsleep)
const sleepyGuard = Object.entries(hoursAsleep)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)[0].key
console.log('sleepyGuard: ', sleepyGuard)

const totalSleptMinutes = events
    .reduce((result, { id, action, minute }) => {
        if (action === SLEEP) sleepStart = minute
        if (action === WAKE) {
            const sleptMinutes = range(minute - sleepStart).map(n => n + sleepStart)
            sleptMinutes.forEach(minute => {
                if (result[id] && result[id][minute]) result[id][minute] += 1
                else if (result[id]) result[id][minute] = 1
                else result[id] = {}
            })
        }
        return result
    }, {})
// console.log('totalSleptMinutes: ', totalSleptMinutes)

const mostSleptMinute = Object.entries(totalSleptMinutes[sleepyGuard])
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)[0].key
console.log('mostSleptMinute: ', mostSleptMinute)

const partOne = sleepyGuard * mostSleptMinute
console.log('partOne: ', partOne)

const summary = Object.entries(totalSleptMinutes)
    .map(([key, value]) => {
        const mostSleptMinute = Object.entries(value)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => b.value - a.value)[0]
        return { id: parseInt(key), minute: parseInt(mostSleptMinute.key), frequency: parseInt(mostSleptMinute.value) }
    })
const partTwo = summary
    .sort((a, b) => b.frequency - a.frequency)[0]
console.log('partTwo: ', partTwo.id * partTwo.minute)
