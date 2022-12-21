const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => {
        if (line.includes("$ ls")) {
            return {
                type: "ls",
            }
        } else if (line.includes("$ cd")) {
            return {
                type: "cd",
                target: line.split(" ").slice(-1)[0],
            }
        } else if (line.includes("dir ")) {
            return {
                type: "dir",
                name: line.split(" ").slice(-1)[0],
            }
        } else {
            return {
                type: "file",
                name: line.split(" ").slice(-1)[0],
                size: parseInt(line.split(" ")[0]),
            }
        }
    })

// console.log('parsed: ', parsed)

let currentAbsolutePath = []

const events = parsed
    .map(instruction => {
        if (instruction.type === "cd") {
            if (instruction.target === "..") {
                currentAbsolutePath.pop()
            } else {
                currentAbsolutePath.push(instruction.target)
            }
        } else if (instruction.type === "file") {
            return {
                name: instruction.name,
                size: instruction.size,
                type: instruction.type,
                path: [...currentAbsolutePath, instruction.name]
            }
        } else if (instruction.type === "dir") {
            return {
                name: instruction.name,
                type: instruction.type,
                path: [...currentAbsolutePath, instruction.name]
            }
        }
        return instruction
    })
    .map(instruction => {
        if (instruction.path) {
            return {
                ...instruction,
                path: instruction.path.join("/").slice(1)
            }
        } else return instruction
    })
// console.log('events: ', events)

const directorySizes = events
    .filter(instruction => instruction.type === "file")
    .reduce((result, file) => {
        file.path
            .split("/")
            .slice(1, -1)
            .forEach((dir, index) => {
                const absolutePath = file.path.split("/").slice(0, index + 2).join("/")
                if (result[absolutePath]) result[absolutePath] += file.size
                else result[absolutePath] = file.size
            })

        if (result["/"]) result["/"] += file.size
        else result["/"] = file.size
        return result
    }, {})
// console.log('directorySizes: ', directorySizes)

const partOne = Object.entries(directorySizes)
    .filter(([key, value]) => value <= 100000)
    .reduce((total, [key, value]) => total + value, 0)
console.log('partOne: ', partOne)

const totalSpace = 70000000
const requiredSpace = 30000000
const usedSpace = directorySizes["/"]
const unusedSpace = totalSpace - usedSpace
const minimumDelete = requiredSpace - unusedSpace
console.log('usedSpace: ', usedSpace)
console.log('unusedSpace: ', unusedSpace)
console.log('minimumDelete: ', minimumDelete)

const dirToDelete = Object.entries(directorySizes)
    .filter(([key, value]) => value >= minimumDelete)
    .sort((a, b) => a[1] - b[1])[0]

console.log('dirToDelete: ', dirToDelete)
