const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
console.log('parsed: ', parsed)

const findStartOfPacket = buffer => {
    let i = 0
    while (i < buffer.length) {
        const window = buffer.slice(i - 4, i)
        if (window.length === 4) {
            if (new Set(window.split("")).size === 4) return i
        }
        i += 1
    }
}
const startOfPacket = findStartOfPacket(parsed)
console.log('startOfPacket: ', startOfPacket)

const findStartOfMssage = buffer => {
    let i = 0
    while (i < buffer.length) {
        const window = buffer.slice(i - 14, i)
        if (window.length === 14) {
            if (new Set(window.split("")).size === 14) return i
        }
        i += 1
    }
}
const m = findStartOfMssage(parsed)
console.log('m: ', m)

