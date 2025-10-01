<template>
    <div class="products-container">
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <h1>Products</h1>
                <p class="subtitle">Manage your product inventory</p>
            </div>
            <router-link to="/products/add" class="add-product-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Product
            </router-link>
        </div>

        <!-- Products List -->
        <div class="products-grid">
            <div v-if="products.length === 0" class="empty-state">
                <div class="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.5">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                </div>
                <h3>No products yet</h3>
                <p>Get started by adding your first product to the inventory.</p>
                <router-link to="/products/add" class="btn btn-primary">
                    Add Your First Product
                </router-link>
            </div>

            <div v-else class="product-card" v-for="product in products" :key="product.id">
                <div class="product-image">
                    <img :src="product.pic_info || '/img/placeholder.svg'" :alt="product.name" />
                </div>
                <div class="product-info">
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-category">{{ product.category }}</p>
                    <div class="product-details">
                        <span class="product-price">${{ product.price }}</span>
                        <span class="product-stock">{{ product.stock }} in stock</span>
                    </div>
                    <div class="product-status">
                        <span :class="['status-badge', product.status === 1 ? 'published' : 'unpublished']">
                            {{ product.status === 1 ? 'Published' : 'Unpublished' }}
                        </span>
                    </div>
                </div>
                <div class="product-actions">
                    <button v-if="product.status === 0" @click="publishProduct(product.id!)"
                        class="btn btn-sm btn-success">
                        Publish
                    </button>
                    <button v-else @click="unpublishProduct(product.id!)" class="btn btn-sm btn-warning">
                        Unpublish
                    </button>
                    <button @click="updateStock(product)" class="btn btn-sm btn-outline">Stock</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ProductAPI, type ProductInfo, ProductStatus } from '../services/product'
import { notification } from '../utils/notification'
import { handleAPIError, HTTP_STATUS } from '../services/auth'

// 产品列表数据
const products = ref<ProductInfo[]>([])
const isLoading = ref(false)

// 获取产品列表 - 这里我们先用示例数据，后续可以添加真实的API端点
const loadProducts = async () => {
    isLoading.value = true
    try {
        // 由于API文档中没有列表端点，我们先使用示例数据
        // 在实际项目中，需要后端提供产品列表API
        products.value = []
    } catch (error) {
        console.error('Error loading products:', error)
        notification.error('Failed to load products', 'Error')
    } finally {
        isLoading.value = false
    }
}

// 上架产品
const publishProduct = async (productId: number) => {
    try {
        const response = await ProductAPI.publishProduct(productId)
        if (response.code === HTTP_STATUS.OK) {
            notification.success('Product published successfully!', 'Success')
            // 更新本地状态
            const product = products.value.find(p => p.id === productId)
            if (product) {
                product.status = ProductStatus.PUBLISHED
            }
        } else {
            notification.error(handleAPIError(response, 'Failed to publish product'), 'Error')
        }
    } catch (error) {
        console.error('Error publishing product:', error)
        notification.error('Network error, please try again later', 'Connection Error')
    }
}

// 下架产品
const unpublishProduct = async (productId: number) => {
    try {
        const response = await ProductAPI.unpublishProduct(productId)
        if (response.code === HTTP_STATUS.OK) {
            notification.success('Product unpublished successfully!', 'Success')
            // 更新本地状态
            const product = products.value.find(p => p.id === productId)
            if (product) {
                product.status = ProductStatus.UNPUBLISHED
            }
        } else {
            notification.error(handleAPIError(response, 'Failed to unpublish product'), 'Error')
        }
    } catch (error) {
        console.error('Error unpublishing product:', error)
        notification.error('Network error, please try again later', 'Connection Error')
    }
}

// 更新库存
const updateStock = async (product: ProductInfo) => {
    if (product.status === ProductStatus.PUBLISHED) {
        notification.warning('Please unpublish the product first before updating stock', 'Cannot Update Stock')
        return
    }

    const newStock = prompt(`Current stock: ${product.stock}\nEnter new stock quantity:`, product.stock?.toString())
    if (newStock === null) return

    const stockNumber = parseInt(newStock)
    if (isNaN(stockNumber) || stockNumber < 0) {
        notification.error('Please enter a valid stock quantity', 'Invalid Input')
        return
    }

    try {
        const response = await ProductAPI.updateStock(product.id!, stockNumber)
        if (response.code === HTTP_STATUS.OK) {
            notification.success('Stock updated successfully!', 'Success')
            // 更新本地状态
            product.stock = stockNumber
        } else {
            notification.error(handleAPIError(response, 'Failed to update stock'), 'Error')
        }
    } catch (error) {
        console.error('Error updating stock:', error)
        notification.error('Network error, please try again later', 'Connection Error')
    }
}

// 组件挂载时加载产品
onMounted(() => {
    loadProducts()
})
</script>

<style scoped>
.products-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    background: #f8f9fb;
    min-height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
}

.header-content h1 {
    font-size: 28px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.subtitle {
    color: #64748b;
    font-size: 14px;
    margin: 0;
}

.add-product-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #dc6643;
    color: white;
    text-decoration: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s;
}

.add-product-btn:hover {
    background: #c55a3a;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 64px 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
    color: #9ca3af;
    margin-bottom: 24px;
}

.empty-state h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.empty-state p {
    color: #64748b;
    margin: 0 0 24px 0;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: #dc6643;
    color: white;
}

.btn-primary:hover {
    background: #c55a3a;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 12px;
}

.btn-outline {
    background: transparent;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-outline:hover {
    background: #f3f4f6;
}

.btn-danger {
    background: #ef4444;
    color: white;
}

.btn-danger:hover {
    background: #dc2626;
}

.product-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
    background: #f3f4f6;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
}

.product-category {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 12px 0;
    text-transform: capitalize;
}

.product-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.product-price {
    font-size: 18px;
    font-weight: 600;
    color: #dc6643;
}

.product-stock {
    font-size: 12px;
    color: #64748b;
}

.product-status {
    margin-top: 8px;
}

.status-badge {
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.published {
    background: #dcfce7;
    color: #166534;
}

.status-badge.unpublished {
    background: #fef3c7;
    color: #92400e;
}

.product-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.btn-success {
    background: #10b981;
    color: white;
}

.btn-success:hover {
    background: #059669;
}

.btn-warning {
    background: #f59e0b;
    color: white;
}

.btn-warning:hover {
    background: #d97706;
}

@media (max-width: 768px) {
    .products-container {
        padding: 16px;
    }

    .header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .add-product-btn {
        justify-content: center;
    }

    .products-grid {
        grid-template-columns: 1fr;
    }
}
</style>