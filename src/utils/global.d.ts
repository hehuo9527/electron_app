declare
interface Window {
  api: {
    onMessage: (callback: (message: string) => void) => void
    sendMessage: (message: string) => void
  }
}
