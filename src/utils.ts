import { exec as processExec } from 'node:child_process'
import chalk from 'chalk'
import { ensureFile } from 'fs-extra/esm'

export const exec = (command: string) => {
  return new Promise<[false, any] | [true, string]>((resolve) => {
    processExec(command, (error, stdout, stderr) => {
      if (error) {
        resolve([false, error])
        return
      }
      resolve([true, stdout ? stdout : stderr])
    })
  })
}

export const checkNpmPkg = async (pkg: string) => {
  const [isNpmOk] = await exec(`npm list -g ${pkg}`)
  if (isNpmOk) {
    return true
  }
  const [isYarnOk] = await exec(`yarn list -g ${pkg}`)
  if (isYarnOk) {
    return true
  }
  return false
}

export const installGlobalNpmPkg = async (pkg: string) => {
  const [isNpmOk] = await exec(`npm install -g ${pkg}`)
  return isNpmOk
}

export const installScopeNpmPkg = async (pkg: string, isDev = true) => {
  const [isNpmOk] = await exec(`ni ${pkg} ${isDev ? '-D' : ''}`)
  return isNpmOk
}

export const checkPkgJson = async () => {
  return await ensureFile('package.json')
}

export const infoLog = (str: string) => console.log(chalk.gray(str)) 
export const successLog = (str: string) => console.log(chalk.green(str))
export const errorLog = (str: string) => console.log(chalk.red(str))
