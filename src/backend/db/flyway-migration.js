// Inspired by:
// https://github.com/markgardner/node-flywaydb/blob/HEAD/sample/config.js

const config = require('../../config/backend.js')

module.exports = function() {
  let url = `jdbc:postgresql://${config.db.host}:${config.db.port}/${config.db.database}`
  let password = config.db.password
  if (process.platform === 'win32') {
    url =`"${url}"`
    password = `"${password}"`
  }
  return {
    flywayArgs: {
      url,
      schemas: 'public',
      locations: 'filesystem:src/backend/db/migration',
      user: config.db.user,
      password,
      sqlMigrationSuffixes: '.sql',
      baselineVersion: '0.0',
      baselineDescription: 'init',
      baselineOnMigrate: true
    },
    version: '8.5.10',
    downloads: {
      storageDirectory: 'flyway',
      expirationTimeInMs: -1
    }
  }
}