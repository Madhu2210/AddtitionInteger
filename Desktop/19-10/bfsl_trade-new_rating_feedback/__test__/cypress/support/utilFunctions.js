
var givenFileName = getEnvFile()

var envData = require(`../envConfig/${givenFileName}.json`)

export function getEnvFile() {
    const file = Cypress.env('configFile') || 'dev'
    return file
}

export function getEnvData() {
    return envData
}