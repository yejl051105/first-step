import fs from 'fs'
import { SETTINGS_PATH } from '../config/path.js'

export const read = () => {
  const fileContent = fs.readFileSync(SETTINGS_PATH, 'utf-8')
  return JSON.parse(fileContent)
}

export const write = (data) => {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2), 'utf-8')
}
