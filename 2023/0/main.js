const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => line.split(""))

console.log('parsed:', parsed)
