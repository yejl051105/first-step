module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production',
  JWT_EXPIRES_IN: '2h',
}
