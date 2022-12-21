const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n")
    .map(line => {
        const roomName = line.split("[")[0].split("-").slice(0, -1).join("-")
        const sectorId = parseInt(line.split("[")[0].split("-").slice(-1)[0])
        const checksum = line.split("[")[1].slice(0, -1)
        return {
            roomName,
            sectorId,
            checksum,
        }
    })

const calculateChecksum = roomName => {
    const uniqueLetters = {}
    roomName
        .replaceAll("-", "")
        .split("")
        .forEach(letter => {
            const count = (roomName.match(new RegExp(letter, "g")) || []).length
            uniqueLetters[letter] = count
        })

    const checksum = Object.entries(uniqueLetters)
        .sort()
        .sort(([a, aCount], [b, bCount]) => {
            return bCount - aCount
        })
        .map(([letter, count]) => letter)
        .slice(0, 5)
        .join("")
    return checksum
}

const listOfRooms = parsed
    .map(({ roomName, sectorId, checksum }) => {
        const calculatedChecksum = calculateChecksum(roomName)
        return {
            roomName,
            sectorId,
            checksum,
            calculatedChecksum,
            valid: checksum === calculatedChecksum
        }
    })

const sumOfValidSectorIds = listOfRooms.reduce((total, { valid, sectorId }) => {
    if (valid) return total + sectorId
    else return total
}, 0)

console.log('sumOfValidSectorIds: ', sumOfValidSectorIds)

const letterToNumber = letter => letter.charCodeAt(0) - 97
const numberToLetter = number => String.fromCharCode(97 + number)

const shiftCipher = ({ roomName, sectorId, ...other }) => {
    const decryptedName = roomName
        .split("")
        .map(letter => {
            if (letter === "-") return " "
            else {
                const number = letterToNumber(letter)
                const shiftedNumber = (number + sectorId) % 26
                const shiftedLetter = numberToLetter(shiftedNumber)
                return shiftedLetter
            }
        })
        .join("")

    return {
        decryptedName,
        roomName,
        sectorId,
        ...other
    }
}

const decryptedRooms = listOfRooms
    .filter(({ valid }) => valid)
    .map(shiftCipher)
    .filter(({ decryptedName }) => decryptedName.includes("pole"))


console.log('decryptedRooms: ', decryptedRooms)
