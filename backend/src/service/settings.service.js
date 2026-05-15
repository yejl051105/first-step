import * as settingsModel from '../model/settings.model.js'

export const getSettings = () => {
  try {
    return settingsModel.read()
  } catch {
    return null
  }
}

export const setSettings = (data) => {
  const { username, email, role, profile, status, id } = data
  const settingsData = { username, email, role, profile, status, id }
  settingsModel.write(settingsData)
  return settingsData
}
