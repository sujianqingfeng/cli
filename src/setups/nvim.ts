import { errorLog, exec, infoLog, isPlatformWin, successLog } from '../utils'

const REPO_URL = 'https://github.com/sujianqingfeng/NvChad'

export const setupNvim = async () => {
  const isWin = isPlatformWin()
  const dir = isWin ? '$HOME\\AppData\\Local\\nvim' : '~/.config/nvim'
  infoLog(`Cloning NvChad to ${dir}`)
  const [isOk] =  await exec(`git clone ${REPO_URL} ${dir} --depth 1`)
  if (!isOk) {
    errorLog('❌ Cloning NvChad failed!')
    return
  }
  successLog('NvChad cloned successfully!')
}