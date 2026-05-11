const fs = require('fs')
const { SETTINGS_PATH } = require('../config/path')

const read = () => {
  const fileContent = fs.readFileSync(SETTINGS_PATH, 'utf-8')
  return JSON.parse(fileContent)
}

const write = (data) => {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

module.exports = { read, write }
