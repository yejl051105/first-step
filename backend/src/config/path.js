import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const SETTINGS_PATH = path.resolve(__dirname, '../../data/settings.json')
export const USERDATA_PATH = path.resolve(__dirname, '../../data/userData.json')
