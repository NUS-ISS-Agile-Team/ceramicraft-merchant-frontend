/**
 * @file 产品API服务
 * @description 管理产品相关的API调用
 */

import type {BaseResponse} from './auth'

// 产品状态枚举
export enum ProductStatus {
  UNPUBLISHED = 0,  // 未上架
  PUBLISHED = 1     // 已上架
}

// 产品信息类型 - 根据API文档定义
export interface ProductInfo {
  id?: number
  name: string
  category: string
  price: number
  stock: number
  desc: string
  pic_info?: string
  dimensions?: string
  material?: string
  weight?: string
  capacity?: string
  care_instructions?: string
  status?: ProductStatus
}

// 创建产品请求类型
export interface CreateProductRequest {
  name: string
  category: string
  price: number
  stock: number
  desc: string
  pic_info?: string
  dimensions?: string
  material?: string
  weight?: string
  capacity?: string
  care_instructions?: string
}

// 更新产品状态请求
export interface UpdateProductStatusRequest {
  id: number
}

// 更新产品库存请求
export interface UpdateProductStockRequest {
  id: number
  stock: number
}

// 产品API服务类
export class ProductAPI {
  private static readonly BASE_URL = '/api/product-ms/v1/merchant'

      /**
       * 添加商品
       * @param productData 商品数据
       * @returns Promise<BaseResponse>
       */
      static async addProduct(productData: CreateProductRequest):
          Promise<BaseResponse> {
    const response = await fetch(`${this.BASE_URL}/add`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(productData),
      credentials: 'include'  // 包含cookies进行认证
    })

    return response.json()
  }

  /**
   * 获取商品详情
   * @param productId 商品ID
   * @returns Promise<BaseResponse<ProductInfo>>
   */
  static async getProduct(productId: number):
      Promise<BaseResponse<ProductInfo>> {
    const response = await fetch(
        `${this.BASE_URL}/product/${productId}`,
        {method: 'GET', credentials: 'include'})

    return response.json()
  }

  /**
   * 上架商品
   * @param productId 商品ID
   * @returns Promise<BaseResponse>
   */
  static async publishProduct(productId: number): Promise<BaseResponse> {
    const response = await fetch(`${this.BASE_URL}/publish`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: productId}),
      credentials: 'include'
    })

    return response.json()
  }

  /**
   * 下架商品
   * @param productId 商品ID
   * @returns Promise<BaseResponse>
   */
  static async unpublishProduct(productId: number): Promise<BaseResponse> {
    const response = await fetch(`${this.BASE_URL}/unpublish`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: productId}),
      credentials: 'include'
    })

    return response.json()
  }

  /**
   * 更新商品库存
   * @param productId 商品ID
   * @param stock 新的库存数量
   * @returns Promise<BaseResponse>
   */
  static async updateStock(productId: number, stock: number):
      Promise<BaseResponse> {
    const response = await fetch(`${this.BASE_URL}/updateStock`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: productId, stock: stock}),
      credentials: 'include'
    })

    return response.json()
  }
}