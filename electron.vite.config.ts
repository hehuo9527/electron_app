import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import electronRenderer from 'vite-plugin-electron-renderer'
import polyFillExports from 'vite-plugin-electron-renderer'
import dotenv from 'dotenv'

dotenv.config({ path: resolve('src/.env') })
export default defineConfig({
  main: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // 移除所有 console.log
          drop_debugger: true // 移除所有 debugger
        }
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // 移除所有 console.log
          drop_debugger: true // 移除所有 debugger
        }
      }
    },
    resolve: {
      alias: {
        '@src': resolve(__dirname, 'src'),
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue(), electronRenderer(), polyFillExports()],
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
