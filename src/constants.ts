export const isWin = process.platform === 'win32'

export const NI_PKG_NAME = '@antfu/ni'
export const ESLINT_PKG_NAME = 'eslint'
export const ESLINT_NPK_MAP = {
  'vue3-ts': {
    pkgName: '@sujian/eslint-config-vue3-ts',
    configName: '@sujian/vue3-ts'
  },
  'ts': {
    pkgName: '@sujian/eslint-config-typescript',
    configName: '@sujian/typescript'
  } 
}

export const ESLINT_NAMES = Object.keys(ESLINT_NPK_MAP)