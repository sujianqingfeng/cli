import { cac } from 'cac'
import { setupEslint } from './setups/eslint'

const cli = cac('cli').help()

cli
  .command('setup-eslint [name]', 'setup eslint')
  .action((name) => {
    setupEslint({ name })
  })

cli.parse()