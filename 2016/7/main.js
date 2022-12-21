const { readFile } = require("../../common/io.js")

const data = readFile(__dirname)

const parsed = data
    .split("\n")
    .map(line => {
        const SPLITCHAR = "-"
        const segments = line.replaceAll("[", SPLITCHAR).replaceAll("]", SPLITCHAR).split(SPLITCHAR)
        const addressSequences = segments.filter((sequence, index) => index % 2 === 0)
        const hypernetSequences = segments.filter((sequence, index) => index % 2 === 1)
        return {
            addressSequences,
            hypernetSequences,
        }
    })
    .map(({ hypernetSequences, addressSequences }) => {
        const getAbbaSequence = line => {
            return line
                .split("")
                .map((value, index) => {
                    if (index + 3 < line.length) {
                        if (
                            line[index] === line[index + 3]
                            && line[index + 1] === line[index + 2]
                            && line[index] != line[index + 1]
                        ) return {
                            tls: true,
                            abbaSequence: line.slice(index, index + 4)
                        }
                    }
                })
                .filter(value => Boolean(value))[0]
        }
        const goodAbbaSequence = addressSequences
            .map(line => getAbbaSequence(line))
            .filter(value => Boolean(value))[0]

        const badAbbaSequence = hypernetSequences
            .map(line => getAbbaSequence(line))
            .filter(value => Boolean(value))[0]

        return {
            addressSequences,
            hypernetSequences,
            ...(!Boolean(badAbbaSequence) && goodAbbaSequence ? goodAbbaSequence : { tls: false }),
        }
    })
    .map(({ hypernetSequences, addressSequences, ...other }) => {
        const getAbaSequences = line => {
            return line
                .split("")
                .map((value, index) => {
                    if (index + 2 < line.length) {
                        if (
                            line[index] === line[index + 2]
                            && line[index] != line[index + 1]
                        ) return line.slice(index, index + 3)
                    }
                })
                .filter(value => Boolean(value))
        }
        const abaSequences = addressSequences
            .map(line => getAbaSequences(line))
            .flat()
            .filter(value => Boolean(value))

        const babSequences = hypernetSequences
            .map(line => getAbaSequences(line))
            .flat()
            .filter(value => Boolean(value))

        return {
            ...other,
            addressSequences,
            hypernetSequences,
            abaSequences,
            babSequences,
        }
    })
    .map(value => {
        const someSsl = value.abaSequences
            .some(abaSequence => value.babSequences.includes(abaSequence[1] + abaSequence[0] + abaSequence[1]))
        return {
            ...value,
            ssl: someSsl
        }
    })
console.log('parsed: ', parsed)

const howManyTLS = parsed.filter(value => value.tls).length
console.log('howManyTLS: ', howManyTLS)

const howManySSL = parsed.filter(value => value.ssl).length
console.log('howManySSL: ', howManySSL)
