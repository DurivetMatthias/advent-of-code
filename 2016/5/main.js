const { readFile } = require("../../common/io.js")
var md5 = require('md5')

const data = readFile(__dirname)

const parsed = data
console.log('parsed: ', parsed)

const findPassword = (roomId, passwordLength = 8) => {
    let password = ""
    let index = 0
    while (password.length < passwordLength) {
        const hash = md5(roomId + String(index))
        if (hash.slice(0, 5) === "0".repeat(5)) {
            password += hash[5]
            console.log('password: ', password)
        }
        index += 1
    }
    return password
}

// const password = findPassword(parsed)
// console.log('password: ', password)

const findPassword2 = (roomId, passwordLength = 8) => {
    let password = {

    }
    let index = 0
    while (Object.keys(password).length < passwordLength) {
        const hash = md5(roomId + String(index))
        if (hash.slice(0, 5) === "0".repeat(5)) {
            const position = hash[5]
            const value = hash[6]
            if (!isNaN(position) && parseInt(position) < passwordLength)
                if (!password[position]) {
                    password[position] = value
                    console.log('password: ', password)
                }
        }
        index += 1
    }
    return Object.values(password).join("")
}

const password = findPassword2(parsed)
console.log('password: ', password)
