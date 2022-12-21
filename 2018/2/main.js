const { readFile } = require("../../common/io.js")

const parsed = readFile(__dirname)
    .split("\n")
//     .map(line => {
//         return line
//             .split("")
//             .reduce((result, letter) => {
//                 const newResult = { ...result }
//                 if (result[letter]) newResult[letter] += 1
//                 else newResult[letter] = 1
//                 return newResult
//             }, {})
//     })
//     .map(e => ({
//         twice: Object.values(e).includes(2),
//         thrice: Object.values(e).includes(3),
//     }))

// console.log('parsed: ', parsed)
// const checksum = parsed
//     .reduce((total, e) => {
//         return {
//             twice: total.twice + e.twice,
//             thrice: total.thrice + e.thrice,
//         }
//     }, { twice: 0, thrice: 0 })
// console.log('checksum: ', checksum.twice * checksum.thrice)

let i = 0
while (i < parsed[0].length) {
    const modified = parsed.map(line => line.slice(0, i) + line.slice(i + 1))
    modified.forEach((line, lineIndex) => {
        if ([...modified.slice(0, lineIndex), ...modified.slice(lineIndex + 1)].includes(line)) console.log(line)
    })
    i += 1
}
