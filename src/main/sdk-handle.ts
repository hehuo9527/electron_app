import { execFileSync } from 'child_process'
import { tr } from 'element-plus/es/locale'

export function startSDK() {
  try {
    const pythonProcess = execFileSync('python', ['test_socket.py'])
  } catch (error) {
    console.error('Error executing file:', error)
  }
}
