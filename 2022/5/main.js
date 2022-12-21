const fs = require("fs")
const path = require("node:path")
const readFile = (filePath, filename) => {
    return fs.readFileSync(path.join(filePath, filename), "utf8")
}
const transpose = matrix => {
    return matrix[0].map((col, i) => matrix.map(row => row[i]))
}
const range = n => Array.from(Array(n).keys())
const printSquare = square => console.log(square.map(row => row.join(" ")).join("\n"))

const crates = transpose(
    readFile(__dirname, "crates.txt")
        .split("\n")
        .reverse()
        .map(line => line
            .replaceAll("    ", "[*] ")
            .split(" ")
            .map(crate => crate[1])
        )
)
    .map(stack => stack.filter(crate => crate !== "*" && crate !== undefined))

const operations = readFile(__dirname, "operations.txt")
    .split("\n")
    .map(line => line.replaceAll("move ", "").replaceAll("from ", "").replaceAll("to ", ""))
    .map(line => line.split(" ").map(n => parseInt(n)))
    .map(line => ({
        amount: line[0],
        from: line[1] - 1,
        to: line[2] - 1,
    }))
console.log(crates)
console.log(operations)

operations.forEach(({ amount, from, to }) => {
    // Part 1
    // range(amount).forEach(() => {
    //     const targetCrate = crates[from].pop()
    //     crates[to].push(targetCrate)
    //     printSquare(crates)
    //     console.log("-".repeat(10))
    // })
    // Part 2
    const targetCrates = crates[from].splice(-amount)
    crates[to] = crates[to].concat(targetCrates)

    printSquare(crates)
    console.log("-".repeat(10))
})

const topCrates = crates.map(
    stack => stack.slice(-1)[0]
).join("")
console.log('topCrates: ', topCrates)
