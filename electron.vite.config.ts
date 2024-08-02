import { resolve } from 'path'
// import { searchForWorkspaceRoot } from 'vite'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import electronRenderer from 'vite-plugin-electron-renderer'
import polyFillExports from 'vite-plugin-electron-renderer'
import dotenv from 'dotenv'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

dotenv.config({ path: resolve('src/.env') })
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@src': resolve(__dirname, 'src'),
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      electronRenderer(),
      polyFillExports(),
      vueI18n({
        include: resolve('src/i18n/*')
      })
    ],
    server: {
      hmr: true
      // fs: {
      //   allow: [
      //     searchForWorkspaceRoot(process.cwd()),
      //     '../../output/calibration/calib0.png',
      //     '../../output/calibration/calib1.png',
      //     '../backend/PreProcess/config/params.json'
      //   ]
      // }
    }
  }
})
