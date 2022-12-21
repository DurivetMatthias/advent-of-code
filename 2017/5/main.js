const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => parseInt(line))

console.log('parsed: ', parsed)

const followInstructions = instructions => {
    const instructionsCopy = [...instructions]

    let steps = 0
    let currentPosition = 0
    while (currentPosition < instructionsCopy.length) {
        const instruction = instructionsCopy[currentPosition]
        if (instruction >= 3) {
            instructionsCopy[currentPosition] = instruction - 1
        } else {
            instructionsCopy[currentPosition] = instruction + 1
        }
        currentPosition += instruction

        steps += 1
    }
    console.log('steps: ', steps)
    console.log('instructionsCopy: ', instructionsCopy)
}
followInstructions(parsed)
