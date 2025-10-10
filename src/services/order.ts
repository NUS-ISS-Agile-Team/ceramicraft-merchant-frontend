/**
 * @file 订单API服务
 * @description 管理订单相关的API调用
 */

import type { BaseResponse } from './auth'

// 订单状态枚举
export enum OrderStatus {
  CREATED = 0,    // 已创建
  PAID = 1,       // 已支付
  CONFIRMED = 2,  // 已确认
  SHIPPED = 3,    // 已发货
  COMPLETED = 4,  // 已完成
  CANCELLED = 5   // 已取消
}

// 订单详情类型
export interface OrderDetail {
  id: string
  user_id: number
  merchant_id: number
  product_id: number
  quantity: number
  amount: number
  status: OrderStatus
  created_at: string
  updated_at: string
  product_snapshot?: {
    name: string
    price: number
    pic_info?: string
  }
  shipping_address?: {
    recipient_name: string
    phone_number: string
    address: string
    postal_code: string
  }
}

// 获取订单列表的参数
export interface OrderListParams {
  page?: number
  page_size?: number
  status?: OrderStatus
  start_time?: string
  end_time?: string
}

// 订单列表响应
export interface OrderListResponse {
  orders: OrderDetail[]
  total: number
  page: number
  page_size: number
}

// 订单API服务类
export class OrderAPI {
  private static readonly BASE_URL = '/api/order-ms/v1/merchant'
  // Use proxied relative path so dev server (vite) can forward requests to the backend
  // Vite proxy in vite.config.ts maps '/api' -> 'http://47.129.72.211'
  private static readonly PROXY_BASE = '/api/order-ms/v1/merchant'

  /**
   * 获取订单列表
   * @param params 查询参数
   * @returns Promise<BaseResponse<OrderListResponse>>
   */
  static async getOrderList(params: OrderListParams = {}): Promise<BaseResponse<OrderListResponse>> {
    console.log('Fetching orders with params:', params)

    const queryParams = new URLSearchParams()
    if (params.page !== undefined) queryParams.append('page', params.page.toString())
    if (params.page_size !== undefined) queryParams.append('page_size', params.page_size.toString())
    if (params.status !== undefined) queryParams.append('status', params.status.toString())
    if (params.start_time) queryParams.append('start_time', params.start_time)
    if (params.end_time) queryParams.append('end_time', params.end_time)

    const queryString = queryParams.toString()
    const url = `${OrderAPI.BASE_URL}/orders${queryString ? `?${queryString}` : ''}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  /**
   * 使用后端提供的 POST 接口获取商户订单列表（外部地址）
   * 请求体格式参考后端 curl
   * @param body 请求体字段映射：limit, offset, order_status, order_no, start_time, end_time, user_id
   */
  static async fetchMerchantOrders(body: Partial<{ limit: number; offset: number; order_no: string; order_status: number; start_time: string; end_time: string; user_id: number }> = {}): Promise<any> {
  // Use proxied endpoint to avoid CORS in browser and allow cookies/credentials to be forwarded
  const url = `${OrderAPI.PROXY_BASE}/list`

    // 从 localStorage 读取 token（前端 login 使用 localStorage.setItem('userToken', 'logged_in')）
    const token = localStorage.getItem('userToken')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }

    if (token) {
      // 假设后端接受 Bearer token；如果真实后端使用 cookie，则 credentials: 'include' 也会发送 cookie
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      // 构造请求体，仅包含有值的字段，避免发送空字符串给后端导致解析错误
      const payload: Record<string, unknown> = {}
      if (body.limit !== undefined) payload.limit = body.limit
      if (body.offset !== undefined) payload.offset = body.offset
      if (body.order_no !== undefined && body.order_no !== '') payload.order_no = body.order_no
      if (body.order_status !== undefined) payload.order_status = body.order_status
      if (body.start_time !== undefined && body.start_time !== '') payload.start_time = body.start_time
      if (body.end_time !== undefined && body.end_time !== '') payload.end_time = body.end_time
      if (body.user_id !== undefined) payload.user_id = body.user_id

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        // 保留 cookie 支持
        credentials: 'include'
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`HTTP ${response.status} - ${text}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error fetching merchant orders (external):', error)
      throw error
    }
  }

  /**
   * 获取订单详情
   * @param orderId 订单ID
   * @returns Promise<BaseResponse<OrderDetail>>
   */
  static async getOrderDetail(orderId: string): Promise<BaseResponse<OrderDetail>> {
    console.log('Fetching order detail for ID:', orderId)

    try {
      const response = await fetch(`${OrderAPI.BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error fetching order detail:', error)
      throw error
    }
  }

  /**
   * 获取今日订单统计
   * @returns Promise<BaseResponse<{ total_orders: number, total_amount: number }>>
   */
  static async getTodayOrders(): Promise<BaseResponse<{ total_orders: number, total_amount: number }>> {
    console.log('Fetching today\'s orders statistics')

    try {
      const response = await fetch(`${OrderAPI.BASE_URL}/orders/today`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error fetching today\'s orders:', error)
      throw error
    }
  }

  /**
   * 发货订单
   * @param orderId 订单ID
   * @returns Promise<BaseResponse<void>>
   */
  static async shipOrder(orderId: string): Promise<BaseResponse<void>> {
    console.log('Shipping order:', orderId)

    try {
      const response = await fetch(`${OrderAPI.BASE_URL}/orders/${orderId}/ship`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error shipping order:', error)
      throw error
    }
  }
}