import { ESLINT_NAMES, NI_PKG_NAME } from '../constants'
import { checkNpmPkg, errorLog, infoLog, installGlobalNpmPkg } from '../utils'

type EslintSetupOption = {
  name: string
}

export const setupEslint = async (option: EslintSetupOption) => {
  const { name } = option

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
}