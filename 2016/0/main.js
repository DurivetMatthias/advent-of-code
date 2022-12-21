const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)

console.log('parsed: ', parsed)
