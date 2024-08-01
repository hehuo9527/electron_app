import { ElectronAPI } from '@electron-toolkit/preload'

export interface SocketApi {
  onMessage: (callback: (message: string) => void) => void;
  sendMessage: (message: string) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: SocketApi
  }
}
