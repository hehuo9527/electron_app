import axios, { AxiosInstance } from 'axios'
import { AxiosConfig } from '../types/userTypes'
import qs from 'qs'
export class HttpClient {
  private axiosInstance: AxiosInstance

  constructor(config: AxiosConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 300 * 1000,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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
      const response = await this.axiosInstance.post(url, qs.stringify(data))
      return response.data
    } catch (error) {
      console.error('POST请求错误:', error)
      throw error
    }
  }

  // Delete
  async delete(url: string, data?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(url, data)
      return response.data
    } catch (error) {
      console.error('delete请求错误:', error)
      throw error
    }
  }

  // PUT
  async put(url: string, data?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.put(url, data)
      return response.data
    } catch (error) {
      console.error('PUT请求错误:', error)
      throw error
    }
  }
}
