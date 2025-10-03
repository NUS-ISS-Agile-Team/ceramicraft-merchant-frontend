<template>
    <div class="product-detail-container">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading product details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
            </div>
            <h3>Product Not Found</h3>
            <p>{{ error }}</p>
            <router-link to="/products" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i>
                Back to Products
            </router-link>
        </div>

        <!-- Product Detail -->
        <div v-else-if="product" class="product-detail">
            <!-- Header -->
            <div class="detail-header">
                <button @click="goBack" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    Back
                </button>
                <div class="header-actions">
                    <button 
                        @click="toggleProductStatus" 
                        :class="['btn', product.status === 1 ? 'btn-warning' : 'btn-success']"
                        :disabled="actionLoading"
                    >
                        <i :class="product.status === 1 ? 'fas fa-download' : 'fas fa-upload'"></i>
                        {{ actionLoading ? 'Processing...' : (product.status === 1 ? 'Unpublish' : 'Publish') }}
                    </button>
                    <button @click="updateStock" class="btn btn-outline">
                        <i class="fas fa-boxes"></i>
                        Update Stock
                    </button>
                </div>
            </div>

            <!-- Product Content -->
            <div class="product-content">
                <!-- Image Section -->
                <div class="image-section">
                    <div class="product-image">
                        <img :src="getImageUrl(product.pic_info)" :alt="product.name" />
                    </div>
                </div>

                <!-- Info Section -->
                <div class="info-section">
                    <div class="basic-info">
                        <div class="status-badge-container">
                            <span :class="['status-badge', product.status === 1 ? 'published' : 'unpublished']">
                                {{ product.status === 1 ? 'Published' : 'Unpublished' }}
                            </span>
                        </div>
                        <h1 class="product-name">{{ product.name }}</h1>
                        <p class="product-category">{{ formatCategory(product.category) }}</p>
                        
                        <div class="price-stock">
                            <div class="price-info">
                                <span class="price-label">Price</span>
                                <span class="price-value">${{ (product.price / 100).toFixed(2) }}</span>
                            </div>
                            <div class="stock-info">
                                <span class="stock-label">Stock</span>
                                <span class="stock-value">{{ product.stock }} units</span>
                            </div>
                        </div>

                        <div class="description-section">
                            <h3>Description</h3>
                            <p class="description">{{ product.desc }}</p>
                        </div>
                    </div>

                    <!-- Specifications -->
                    <div v-if="hasSpecifications" class="specifications">
                        <h3>Specifications</h3>
                        <div class="spec-grid">
                            <div v-if="product.dimensions" class="spec-item">
                                <span class="spec-label">Dimensions</span>
                                <span class="spec-value">{{ product.dimensions }}</span>
                            </div>
                            <div v-if="product.material" class="spec-item">
                                <span class="spec-label">Material</span>
                                <span class="spec-value">{{ product.material }}</span>
                            </div>
                            <div v-if="product.weight" class="spec-item">
                                <span class="spec-label">Weight</span>
                                <span class="spec-value">{{ product.weight }}</span>
                            </div>
                            <div v-if="product.capacity" class="spec-item">
                                <span class="spec-label">Capacity</span>
                                <span class="spec-value">{{ product.capacity }}</span>
                            </div>
                            <div v-if="product.care_instructions" class="spec-item full-width">
                                <span class="spec-label">Care Instructions</span>
                                <span class="spec-value">{{ product.care_instructions }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ProductAPI, type ProductInfo, ProductStatus } from '../services/product'
import { handleAPIError, HTTP_STATUS } from '../services/auth'
import { notification } from '../utils/notification'

// Router and route
const router = useRouter()
const route = useRoute()

// Component state
const product = ref<ProductInfo | null>(null)
const isLoading = ref(true)
const error = ref<string>('')
const actionLoading = ref(false)

// Props from route
const productId = computed(() => {
    const id = route.params.id
    return typeof id === 'string' ? parseInt(id) : 0
})

// Computed properties
const hasSpecifications = computed(() => {
    if (!product.value) return false
    return !!(
        product.value.dimensions ||
        product.value.material ||
        product.value.weight ||
        product.value.capacity ||
        product.value.care_instructions
    )
})

// Methods
const loadProductDetail = async () => {
    if (!productId.value) {
        error.value = 'Invalid product ID'
        isLoading.value = false
        return
    }

    try {
        isLoading.value = true
        error.value = ''
        
        const response = await ProductAPI.getProduct(productId.value)
        
        if (response.code === HTTP_STATUS.OK && response.data) {
            product.value = response.data
        } else {
            error.value = handleAPIError(response, 'Product not found')
        }
    } catch (err) {
        console.error('Error loading product detail:', err)
        error.value = 'Network error, please try again later'
    } finally {
        isLoading.value = false
    }
}

const getImageUrl = (picInfo?: string) => {
    if (!picInfo) return '/img/placeholder.svg'
    
    try {
        // 尝试解析JSON字符串格式的图片信息
        const imageArray = JSON.parse(picInfo)
        if (Array.isArray(imageArray) && imageArray.length > 0) {
            // 返回第一张图片
            return imageArray[0]
        }
    } catch {
        // 如果不是JSON格式，直接返回原字符串
        console.log('pic_info is not JSON format, using as direct URL:', picInfo)
    }
    
    // 如果是普通字符串且不为空，直接返回
    if (typeof picInfo === 'string' && picInfo.trim()) {
        return picInfo
    }
    
    return '/img/placeholder.svg'
}

const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')
}

const goBack = () => {
    router.back()
}

const toggleProductStatus = async () => {
    if (!product.value) return
    
    actionLoading.value = true
    try {
        let response
        
        if (product.value.status === ProductStatus.PUBLISHED) {
            response = await ProductAPI.unpublishProduct(product.value.id!)
        } else {
            response = await ProductAPI.publishProduct(product.value.id!)
        }
        
        if (response.code === HTTP_STATUS.OK) {
            product.value.status = product.value.status === ProductStatus.PUBLISHED 
                ? ProductStatus.UNPUBLISHED 
                : ProductStatus.PUBLISHED
            
            const action = product.value.status === ProductStatus.PUBLISHED ? 'published' : 'unpublished'
            notification.success(`Product ${action} successfully!`, 'Success')
        } else {
            notification.error(handleAPIError(response, 'Failed to update product status'), 'Error')
        }
    } catch (error) {
        console.error('Error updating product status:', error)
        notification.error('Network error, please try again later', 'Connection Error')
    } finally {
        actionLoading.value = false
    }
}

const updateStock = async () => {
    if (!product.value) return
    
    if (product.value.status === ProductStatus.PUBLISHED) {
        notification.warning('Please unpublish the product first before updating stock', 'Cannot Update Stock')
        return
    }

    const newStock = prompt(
        `Current stock: ${product.value.stock}\nEnter new stock quantity:`, 
        product.value.stock?.toString()
    )
    
    if (newStock === null) return

    const stockNumber = parseInt(newStock)
    if (isNaN(stockNumber) || stockNumber < 0) {
        notification.error('Please enter a valid stock quantity', 'Invalid Input')
        return
    }

    try {
        const response = await ProductAPI.updateStock(product.value.id!, stockNumber)
        if (response.code === HTTP_STATUS.OK) {
            product.value.stock = stockNumber
            notification.success('Stock updated successfully!', 'Success')
        } else {
            notification.error(handleAPIError(response, 'Failed to update stock'), 'Error')
        }
    } catch (error) {
        console.error('Error updating stock:', error)
        notification.error('Network error, please try again later', 'Connection Error')
    }
}

// Lifecycle
onMounted(() => {
    loadProductDetail()
})
</script>

<style scoped>
.product-detail-container {
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    padding: 24px;
    background: #f8f9fb;
    min-height: 100vh;
    box-sizing: border-box;
}

/* Loading State */
.loading-state {
    text-align: center;
    padding: 64px 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
    text-align: center;
    padding: 64px 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-icon {
    color: #ef4444;
    margin-bottom: 24px;
}

.error-state h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.error-state p {
    color: #64748b;
    margin: 0 0 24px 0;
}

/* Header */
.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid #d1d5db;
    color: #374151;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.back-btn:hover {
    background: #f3f4f6;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background: #dc6643;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #c55a3a;
}

.btn-success {
    background: #10b981;
    color: white;
}

.btn-success:hover:not(:disabled) {
    background: #059669;
}

.btn-warning {
    background: #f59e0b;
    color: white;
}

.btn-warning:hover:not(:disabled) {
    background: #d97706;
}

.btn-outline {
    background: transparent;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-outline:hover:not(:disabled) {
    background: #f3f4f6;
}

/* Product Content */
.product-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.image-section {
    display: flex;
    justify-content: center;
}

.product-image {
    width: 100%;
    max-width: 500px;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    background: #f3f4f6;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Info Section */
.info-section {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.status-badge-container {
    margin-bottom: 16px;
}

.status-badge {
    font-size: 11px;
    padding: 6px 12px;
    border-radius: 6px;
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

.product-name {
    font-size: 32px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
    line-height: 1.3;
}

.product-category {
    font-size: 16px;
    color: #64748b;
    margin: 0 0 24px 0;
    text-transform: capitalize;
}

.price-stock {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
}

.price-info, .stock-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.price-label, .stock-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.price-value {
    font-size: 28px;
    font-weight: 600;
    color: #dc6643;
}

.stock-value {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
}

.description-section h3,
.specifications h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 16px 0;
}

.description {
    color: #374151;
    line-height: 1.6;
    margin: 0;
}

/* Specifications */
.spec-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.spec-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.spec-item.full-width {
    grid-column: 1 / -1;
}

.spec-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.spec-value {
    color: #1e293b;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
    .product-detail-container {
        padding: 16px;
        max-width: none;
    }

    .detail-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .header-actions {
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
    }

    .product-content {
        grid-template-columns: 1fr;
        gap: 32px;
        padding: 20px;
    }

    .product-name {
        font-size: 24px;
    }

    .price-stock {
        gap: 20px;
    }

    .spec-grid {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .product-detail-container {
        padding: 20px;
        max-width: 1100px;
    }

    .product-content {
        padding: 28px;
    }
}

@media (min-width: 1025px) {
    .product-detail-container {
        padding: 32px 24px;
        max-width: 1300px;
    }

    .product-content {
        padding: 32px;
    }
}
</style>