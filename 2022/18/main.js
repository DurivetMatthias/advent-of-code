const { readFile } = require("../../common/io.js")
const { range } = require("../../common/util.js")

const parsed = readFile(__dirname)
    .split("\n")
    .map(line => line.split(","))
    .map(line => line.map(n => parseInt(n)))
    .map(line => ({ x: line[0], y: line[1], z: line[2] }))
console.log('parsed.length: ', parsed.length)

const isTouching = (cube, otherCube) => {
    if (cube.x === otherCube.x & cube.y === otherCube.y) {
        if (Math.abs(cube.z - otherCube.z) === 1) return true
    }
    if (cube.x === otherCube.x & cube.z === otherCube.z) {
        if (Math.abs(cube.y - otherCube.y) === 1) return true
    }
    if (cube.z === otherCube.z & cube.y === otherCube.y) {
        if (Math.abs(cube.x - otherCube.x) === 1) return true
    }
    return false
}

const isTouchingDiagonal = (cube, otherCube) => {
    if (cube == otherCube) return false
    return (
        Math.abs(cube.x - otherCube.x) <= 1
        && Math.abs(cube.y - otherCube.y) <= 1
        && Math.abs(cube.z - otherCube.z) <= 1
    )
}
const clusterCubes = cubes => {
    const clusters = []
    cubes.forEach(cube => {
        let foundCluster = false
        clusters.forEach(cluster => {
            if (!foundCluster) {
                const isTouchingCluster = cluster.some(otherCube => {
                    if (cube.x === otherCube.x && cube.y === otherCube.y && cube.z === otherCube.z) return false
                    return isTouching(cube, otherCube)
                })
                if (isTouchingCluster) {
                    cluster.push(cube)
                    foundCluster = true
                }
            }
        })
        if (!foundCluster) {
            clusters.push(
                [
                    cube
                ]
            )
        }
    })
    return clusters
}
const analyzeTouchingSides = cubes => {
    return cubes
        .map(cube => {
            const touching = cubes
                .map(otherCube => {
                    return isTouching(cube, otherCube) ? 1 : 0
                }).reduce((total, n) => total + n)
            return {
                ...cube,
                touching,
                open: 6 - touching,
            }
        })
}

const getSurfaceArea = cluster => {
    const analyzed = analyzeTouchingSides(cluster)
    return analyzed.map(cube => cube.open).reduce((total, n) => total + n)
}
const part1 = getSurfaceArea(parsed)
console.log('part1: ', part1)

const minX = parsed.map(cube => cube.x).sort((a, b) => a - b)[0]
const maxX = parsed.map(cube => cube.x).sort((a, b) => b - a)[0]
const minY = parsed.map(cube => cube.y).sort((a, b) => a - b)[0]
const maxY = parsed.map(cube => cube.y).sort((a, b) => b - a)[0]
const minZ = parsed.map(cube => cube.z).sort((a, b) => a - b)[0]
const maxZ = parsed.map(cube => cube.z).sort((a, b) => b - a)[0]
const bigX = maxX - minX + 3
const bigY = maxY - minY + 3
const bigZ = maxZ - minZ + 3

console.log("minX:", minX)
console.log("maxX:", maxX)
console.log("minY:", minY)
console.log("maxY:", maxY)
console.log("minZ:", minZ)
console.log("maxZ:", maxZ)
console.log("bigX:", bigX)
console.log("bigY:", bigY)
console.log("bigZ:", bigZ)

const fromToRange = (from, to) => range(to - from + 1).map(n => n + from)
const allCubes = (
    fromToRange(minX - 1, maxX + 1).map(x => {
        return fromToRange(minY - 1, maxY + 1).map(y => {
            return fromToRange(minZ - 1, maxZ + 1).map(z => {
                return { x, y, z }
            })
        })
    })
        .flat(2)
)

const totalCubes = bigX * bigY * bigZ
console.log('totalCubes: ', totalCubes)
console.log('allCubes.length: ', allCubes.length)
if (totalCubes !== allCubes.length) console.log("Failed wrong number of all cubes")

const encode = ({ x, y, z }) => [x, y, z].join("/")
const airCubes = allCubes.filter(cube => parsed.every(otherCube => encode(cube) !== encode(otherCube)))
console.log('airCubes.length: ', airCubes.length)
if (totalCubes - airCubes.length !== parsed.length) console.log("Failed: too many air cubes")

let airClusters = clusterCubes(airCubes)
const encodeClusters = clusters => clusters.map(cluster => cluster.length).join("/")
let encoding = encodeClusters(airClusters)
let previousEncoding = ""
while (encoding !== previousEncoding) {
    airClusters = clusterCubes(airClusters.flat())
    previousEncoding = encoding
    encoding = encodeClusters(airClusters)
}
console.log('airClusters.length: ', airClusters.length)
console.log(airClusters.map(cluster => cluster.length).sort((a, b) => b - a))

const trappedAirClusters = airClusters.sort((a, b) => b.length - a.length).slice(1)
console.log('trappedAirClusters.length: ', trappedAirClusters.length)
const totalTrappedCubes = trappedAirClusters.map(cluster => cluster.length).reduce((total, n) => total + n)
console.log('totalTrappedCubes: ', totalTrappedCubes)

const trappedAirSurface = getSurfaceArea(trappedAirClusters.flat())
const part2 = part1 - trappedAirSurface
console.log('part2: ', part2)

const outerLayerCluster = airClusters.sort((a, b) => b.length - a.length)[0]
console.log('outerLayerCluster.length: ', outerLayerCluster.length)
const outerSurfaceArea = getSurfaceArea(outerLayerCluster)
console.log('outerOpenFaces: ', outerSurfaceArea)
const outerSquareFaces = (
    bigX * bigY * 2
    + bigX * bigZ * 2
    + bigZ * bigY * 2
)
console.log('outerSquareFaces: ', outerSquareFaces)
const part22 = outerSurfaceArea - outerSquareFaces
console.log('part22: ', part22)
