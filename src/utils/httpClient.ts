import axios, { AxiosInstance } from 'axios'
import { axiosConfig } from '../types/userTypes'

export class HttpClient {
  private axiosInstance: AxiosInstance

  constructor(config: axiosConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 5000,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // GET
  async get(url: string, params?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.get(url, { params })
      return response.data
    } catch (error) {
      console.error('GET请求错误:', error)
      throw error
    }
  }

  // POST
  async post(url: string, data?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post(url, data)
      return response.data
    } catch (error) {
      console.error('POST请求错误:', error)
      throw error
    }
  }
}
