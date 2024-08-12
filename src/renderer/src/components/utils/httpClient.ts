import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { AxiosConfig } from '../../../../types/userTypes'
import qs from 'qs'
export class HttpClient {
  private axiosInstance: AxiosInstance

  constructor(config: AxiosConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 300 * 1000,
      headers: config.headers || { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  }

  // GET
  async get(path: string, params?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.get(path, { params })
      return response.data
    } catch (error) {
      console.error('GET请求错误:', error)
      throw error
    }
  }

  // POST
  async post(path: string, data?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post(path, qs.stringify(data))
      return response.data
    } catch (error) {
      console.error('POST请求错误:', error)
      throw error
    }
  }

  async postNotserialize(path: string, data?: any): Promise<any> {
    try {
      console.log(data.image)
      const response = await this.axiosInstance.post(path, data,{headers: {'Content-Type': 'multipart/form-data'}})
      return response.data
    } catch (error) {
      console.error('POST请求错误:', error)
      throw error
    }
  }


  // Delete
  async delete(path: string, data?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(path, { data })
      return response.data
    } catch (error) {
      console.error('delete请求错误:', error)
      throw error
    }
  }

  // PUT
  async put(path: string, data?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.put(path, data)
      return response.data
    } catch (error) {
      console.error('PUT请求错误:', error)
      throw error
    }
  }
}
