const fs = require("fs")
const path = require("node:path")

const readFile = (filePath) => {
    return fs.readFileSync(path.join(filePath, "input.txt"), "utf8")
}

module.exports = {
    readFile
}
