export const logger = {
  debug: (msg: string) => {
    console.debug(`[DEBUG] ${new Date().toISOString()} ${msg}`)
  },
  info: (msg: string) => {
    console.info(`[INFO] ${new Date().toISOString()} ${msg}`)
  },
  error: (msg: string, err?: unknown) => {
    console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, err)
  },
}
