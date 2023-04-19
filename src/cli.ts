import { cac } from 'cac'

const cli = cac('cli').help()

cli
  .command('koa', 'create koa project')
  .alias('k')
  .action((name) => {
    console.log('name:', name)
  })

cli.parse()