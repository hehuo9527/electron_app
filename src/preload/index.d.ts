import { ElectronAPI } from '@electron-toolkit/preload'

export interface IElectronAPI {
  // wsSend: (args: string[]) => Promise<void>
  onMessage: (callback: (message: string) => void) => void
  sendMessage: (message: string) => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
