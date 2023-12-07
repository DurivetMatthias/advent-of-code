const fs = require("fs")
const path = require("node:path")

const readFile = (filePath) => {
    return fs.readFileSync(path.join(filePath, "input.txt"), "utf8")
}

const writeFile = (filePath, filename, data) => {
    fs.writeFileSync(path.join(filePath, filename), data)
}

module.exports = {
    readFile,
    writeFile,
}
