import { cac } from 'cac'
import { setupEslint } from './setups/eslint'
import { join } from 'path'

const cli = cac('cli').help()

cli
  .command('setup-eslint [...args]', 'setup eslint')
  .action((args) => {
    const [name, dir] = args
    let rootDir = process.cwd()
    if (dir) {
      rootDir = join(rootDir, dir)
    }
    setupEslint({ name, rootDir })
  })

cli.parse()