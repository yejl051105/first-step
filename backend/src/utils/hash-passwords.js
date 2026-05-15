import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataPath = path.resolve(__dirname, '../../data/userData.json')
const users = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

const SALT_ROUNDS = 10

async function hashAll() {
  for (const user of users) {
    // 如果密码已经是 bcrypt hash（以 $2 开头），跳过
    if (user.pwd && !user.pwd.startsWith('$2')) {
      user.pwd = await bcrypt.hash(user.pwd, SALT_ROUNDS)
      console.log(`Hashed password for: ${user.username}`)
    }
  }
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2) + '\n', 'utf-8')
  console.log('All passwords hashed successfully.')
}

hashAll().catch(console.error)
