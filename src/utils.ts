import { exec as processExec } from 'node:child_process'
import chalk from 'chalk'
import { pathExists } from 'fs-extra/esm'
import path from 'node:path/posix'
import { isFunction } from 'lodash-es'

export const isPlatformWin = () => process.platform === 'win32'

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

export const checkPkgJson = async (rootDir: string) => {
  return await pathExists(path.join(rootDir, 'package.json'))
}

export function createTryWrapper<R = any, T extends any[] = any[]>(
  promiseFn: (...rest: T) => Promise<R>
) {
  if (!isFunction(promiseFn)) {
    throw new Error('createTryWrapper: promiseFn must be a function')
  }
  return async (...rest: Parameters<typeof promiseFn>): Promise<[true, R] | [false, any]> => {
    try {
      const data = await promiseFn(...rest)
      return [true, data]
    } catch (error) {
      return [false, error]
    }
  }
}

export const infoLog = (str: string) => console.log(chalk.gray(str)) 
export const successLog = (str: string) => console.log(chalk.green(str))
export const errorLog = (str: string) => console.log(chalk.red(str))
