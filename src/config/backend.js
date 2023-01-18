function config() {
  return {
    db: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      max: parseInt(process.env.DB_MAX_CONN)
    },
    version: {
      v: process.env.BACKEND_VERSION ?? '0.1.0',
      hash: process.env.BACKEND_VERSION_HASH ?? '0000'
    },
    serverAddress: process.env.BACKEND_SERVER_ADDRESS ?? 'localhost',
    serverPort: process.env.BACKEND_SERVER_PORT ? Number(process.env.BACKEND_SERVER_PORT) : 8081,
    cors: process.env.BACKEND_SERVER_CORS,
    jwtSecret: process.env.JWT_SECRET ?? 'openssl rand -hex 32',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    frontUrl: process.env.FRONT_URL
  }
}

function buildConfig() {
  let hasLocal = true
  const localConfigModule = './backend-local.js'
  try {
    require.resolve(localConfigModule)
  } catch (e) {
    hasLocal = false
  }
  if (hasLocal) {
    return require(localConfigModule)
  }
  return config()
}

module.exports = buildConfig()
