import path from 'path'
import logger from '@logger'
import actors from 'comedy'
import { BackendRootProps } from '@backend/actor/BackendRoot'
import { awaitShutdown, awaitStdin } from '@util'

const moduleName = path.parse(__filename).name
const log = logger({ name: moduleName })

async function backend(
  shutdown: () => boolean
): Promise<void> {
  while (!shutdown()) {
    const actorSystem = actors.createSystem({
      config: {
        "BackendRoot": {
          "onCrash": "respawn"
        }
      },
      resources: [
        'src/backend/db/DBPoolResource',
        'src/backend/db/DBResource',
        'src/backend/supabase/ServiceSupabaseResource',
        'src/backend/actor/CtxResource'
      ],
    })
    const rootActor = await actorSystem.rootActor()

    const backendRootProps: BackendRootProps = {}
    await rootActor.createChild(
      'src/backend/actor/BackendRoot',
      { customParameters: backendRootProps }
    )

    let reload = false
    while (!shutdown() && !reload) {
      const command = await awaitStdin()
      switch (command) {
        case 'r':
          log.info('reloading')
          reload = true
          break
      }
    }

    await actorSystem.destroy()
  }
}

export async function main() {
  log.info(`Starting ${moduleName}`)

  let shutdown = false
  while (!shutdown) { try {
    await Promise.all([
      backend(() => shutdown),
      awaitShutdown(s => shutdown = s)
    ])
  } catch (e) { log.error(e) } }
}

if (require.main === module) {
  main().catch(console.dir)
}
