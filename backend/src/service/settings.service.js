const settingsModel = require('../model/settings.model')

const getSettings = () => {
  try {
    return settingsModel.read()
  } catch {
    return null
  }
}

const setSettings = (data) => {
  const { username, email, role, profile, status, id } = data
  const settingsData = { username, email, role, profile, status, id }
  settingsModel.write(settingsData)
  return settingsData
}

module.exports = { getSettings, setSettings }
