import fs from 'fs'
import { USERDATA_PATH } from '../config/path.js'

export const readAll = () => {
  const fileContent = fs.readFileSync(USERDATA_PATH, 'utf-8')
  return JSON.parse(fileContent)
}

export const writeAll = (data) => {
  fs.writeFileSync(USERDATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export const findById = (id) => {
  const users = readAll()
  return users.find(item => item.id === Number(id))
}

export const findByUsername = (username) => {
  const users = readAll()
  return users.find(item => item.username === username)
}
