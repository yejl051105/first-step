const fs = require('fs')
const { USERDATA_PATH } = require('../config/path')

const readAll = () => {
  const fileContent = fs.readFileSync(USERDATA_PATH, 'utf-8')
  return JSON.parse(fileContent)
}

const writeAll = (data) => {
  fs.writeFileSync(USERDATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

const findById = (id) => {
  const users = readAll()
  return users.find(item => item.id === Number(id))
}

const findByUsername = (username) => {
  const users = readAll()
  return users.find(item => item.username === username)
}

module.exports = { readAll, writeAll, findById, findByUsername }
