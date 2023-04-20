import { cac } from 'cac'
import { join } from 'path'
import { setupEslint, setupNvim } from './setups'

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

cli
  .command('setup-nvim', 'setup nvim')
  .action(() => {
    setupNvim()
  })

cli.parse()