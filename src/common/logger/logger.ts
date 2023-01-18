import fs from 'fs'
import path from 'path'
import pinoLogger, { Logger as PinoLogger } from 'pino'
import pinoPretty from 'pino-pretty'

const logger =
  (config: LoggerConfig) =>
    pinoLogger(
      {...config, level: config.level ?? 'debug' },
      logDestination
    )

export type LoggerConfig = {
  name: string,
  level?: LoggerLevel
}

export type LoggerLevel = 'debug' | 'info' | 'warn' | 'error'

export const logDestination = makeLogDestination()

function makeLogDestination() {
  const logDir = path.join(process.cwd(), 'log')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }

  const logFileName = `${new Date().toISOString().split(':').join("-").split('.')[0]}.log`
  const logFile = path.join(logDir, logFileName)

  return pinoLogger.multistream([
    { level: 'debug', stream: pinoLogger.destination(logFile) },
    { level: 'debug', stream: pinoPretty() }
  ])
}

export { logger as default, logger };
export type Logger = PinoLogger
