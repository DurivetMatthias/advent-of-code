const { readFile } = require("../../common/io.js")
const printSquare = square => console.log(square.map(row => row.join("")).join("\n"))
const range = n => Array.from(Array(n).keys())

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => {
        const regex = new RegExp("#(\\d*) @ (\\d*),(\\d*): (\\d*)x(\\d*)")
        const result = line.match(regex)
        const [id, x, y, width, height] = result.slice(1, 6).map(n => parseInt(n))
        return {
            id,
            x,
            y,
            width,
            height
        }
    })

console.log('parsed: ', parsed)

const createSquare = (height, width) => {
    return new Array(height)
        .fill()
        .map(() => new Array(width).fill("."))
}
const square = createSquare(2000, 2000)
// const square = createSquare(20, 20)
parsed.forEach(({
    id,
    x,
    y,
    width,
    height
}) => {
    range(height).map(n => n + y).forEach(offset => {
        return square[offset] = square[offset]
            .map((value, index) => {
                if (x <= index && index < x + width) {
                    return value === "." ? id : "X"
                } else return value
            })
    })
})
// printSquare(square)
// console.log('square: ', square)
const overlap = square
    .map(row => row
        .reduce((total, value) => value === "X" ? total + 1 : total, 0)
    )
    .reduce((total, value) => total + value, 0)
console.log('overlap: ', overlap)

const expectedIds = parsed
    .reduce((result, { id, width, height }) => {
        result[id] = width * height
        return result
    }, {})
console.log('expectedIds: ', expectedIds)

const actualIds = square
    .map(row => row.reduce((result, value) => {
        if (result[value]) result[value] += 1
        else result[value] = 1
        return result
    }, {}))
    .reduce((result, value) => {
        Object.entries(value).forEach(([key, value]) => {
            if (result[key]) result[key] += value
            else result[key] = value
        })
        return result
    }, {})
delete actualIds["."]
delete actualIds["X"]
console.log('actualIds: ', actualIds)

const bestId = Object.entries(actualIds)
    .filter(([key, value]) => expectedIds[key] === value)[0]
console.log('bestId: ', bestId)
