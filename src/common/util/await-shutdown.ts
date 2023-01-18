import { awaitStdin } from '@common/util/await-stdin'

export async function awaitShutdown(fn: (shutdown: boolean) => void) {
  let shutdown = false
  while (!shutdown) {
    const command = await awaitStdin()
    switch (command) {
      case 'q':
        shutdown = true
        break
    }
    fn(shutdown)
  }
}