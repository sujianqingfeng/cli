import { join } from 'path'
import { ESLINT_NAMES, ESLINT_NPK_MAP, ESLINT_PKG_NAME, NI_PKG_NAME } from '../constants'
import { checkNpmPkg, checkPkgJson, createTryWrapper, errorLog, infoLog, installGlobalNpmPkg, installScopeNpmPkg } from '../utils'
import { pathExists, readJSON  } from 'fs-extra/esm'
import { writeFile } from 'node:fs/promises'
import { merge } from 'lodash-es'

type EslintSetupOption = {
  name: string
  rootDir: string
}

const RC_FILE = '.eslintrc.json'

const VSCODE_SETTING_CONTENT = {
  'prettier.enable': false,
  'editor.codeActionsOnSave': {
    'source.fixAll.eslint': true
  },
  'eslint.validate': [
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact',
    'json',
    'jsonc',
    'json5'
  ]
}

const toEslintRc = async (rootDir: string, configName: string) => {
  const p = join(rootDir, RC_FILE)
  const isExist = await pathExists(p)
  if (isExist) {
    infoLog(`🔍 ${RC_FILE} already exists!`)
    return
  }

  infoLog(`🔍 Creating ${RC_FILE}...`)
  const content = {
    extends: [configName]
  }

  const str = JSON.stringify(content, null, 2)
  writeFile(p, str)
}

const toVsCodeSetting = async (rootDir: string) => {
  const p = join(rootDir, '.vscode', 'settings.json')
  let content = VSCODE_SETTING_CONTENT
  
  const isExist = await pathExists(p)
  if (isExist) {
    infoLog(`🔍 ${p} already exists!`)
    const tryReadJSON = createTryWrapper(readJSON)
    const [isOk, settingJson] = await tryReadJSON(p) 
    if (!isOk) {
      errorLog(`read json error, path:${p}`)
      return
    }
    content = merge(settingJson, content)
  }

  infoLog(`🔍 Creating ${p}...`)
  const str = JSON.stringify(content, null, 2)
  writeFile(p, str)
}

export const setupEslint = async (option: EslintSetupOption) => {
  const { name, rootDir } = option
  const isExistRootDir = await pathExists(rootDir)

  if (!isExistRootDir) {
    errorLog(`❌ ${rootDir} does not exist!`)
    return
  }

  const isNpmDir = await checkPkgJson(rootDir)
  if (!isNpmDir) {
    errorLog(`❌ ${rootDir} is not a npm project!`)
    return
  }

  if (!ESLINT_NAMES.includes(name)) {
    errorLog(`❌ Invalid eslint name: ${name}, please choose one of ${ESLINT_NAMES.join(', ')}`)
    return
  }

  infoLog(`🔍 Checking ${NI_PKG_NAME}...`)
  const isExistNi = await checkNpmPkg(NI_PKG_NAME)

  if (!isExistNi) {
    infoLog(`🔍 Installing ${NI_PKG_NAME}...`)
    const isInstallNi = await installGlobalNpmPkg(NI_PKG_NAME)
    if (!isInstallNi) {
      errorLog(`❌ Failed to install ${NI_PKG_NAME}!`)
      return
    }
  }
  
  const currentEslintPkg = ESLINT_NPK_MAP[name as keyof typeof ESLINT_NPK_MAP]
  const eslintPkgs = `${ESLINT_PKG_NAME} ${currentEslintPkg.pkgName}`
  infoLog(`🔍 Installing ${eslintPkgs}...`)
  const isInstallEslint = await installScopeNpmPkg(eslintPkgs)
  if (!isInstallEslint) {
    errorLog(`❌ Failed to install ${eslintPkgs}!`)
    return
  }
  
  toEslintRc(rootDir, currentEslintPkg.configName)
  toVsCodeSetting(rootDir)
}