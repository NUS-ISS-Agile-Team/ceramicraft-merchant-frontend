<template>
    <div class="add-product-container">
        <!-- Header -->
        <div class="header">
            <div class="breadcrumb">
                <span>Products</span>
                <span class="divider">></span>
                <span class="current">Add New Product</span>
            </div>
            <h1>Add New Product</h1>
            <p class="subtitle">Fill in the details to add a new product to your inventory</p>
        </div>

        <!-- Form Container -->
        <div class="form-container">
            <form @submit.prevent="handleSubmit" class="product-form">
                <!-- Product Name -->
                <div class="form-group">
                    <label class="form-label required">Product Name *</label>
                    <input v-model="form.name" type="text" class="form-input" placeholder="Enter product name"
                        :class="{ 'error': errors.name }" />
                    <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>

                <!-- Category and Price Row -->
                <div class="form-row">
                    <div class="form-group half-width">
                        <label class="form-label required">Category *</label>
                        <select v-model="form.category" class="form-select" :class="{ 'error': errors.category }">
                            <option value="">Select category</option>
                            <option value="pottery">Pottery</option>
                            <option value="ceramics">Ceramics</option>
                            <option value="vases">Vases</option>
                            <option value="bowls">Bowls</option>
                            <option value="decorative">Decorative Items</option>
                        </select>
                        <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
                    </div>

                    <div class="form-group half-width">
                        <label class="form-label required">Price *</label>
                        <div class="price-input-container">
                            <span class="currency-symbol">$</span>
                            <input v-model="form.price" type="number" step="0.01" min="0" class="form-input price-input"
                                placeholder="0.00" :class="{ 'error': errors.price }" />
                        </div>
                        <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
                    </div>
                </div>

                <!-- Stock -->
                <div class="form-group">
                    <label class="form-label required">Stock *</label>
                    <input v-model="form.stock" type="number" min="0" class="form-input stock-input" placeholder="0"
                        :class="{ 'error': errors.stock }" />
                    <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
                </div>

                <!-- Product Image URL -->
                <div class="form-group">
                    <label class="form-label">Product Image URL</label>
                    <input v-model="form.pic_info" type="url" class="form-input"
                        placeholder="Enter image URL (optional)" />
                    <div v-if="form.pic_info" class="image-preview-small">
                        <img :src="form.pic_info" alt="Product preview" />
                    </div>
                </div>

                <!-- Description -->
                <div class="form-group">
                    <label class="form-label required">Description *</label>
                    <textarea v-model="form.desc" class="form-textarea" placeholder="Enter product description" rows="4"
                        :class="{ 'error': errors.desc }"></textarea>
                    <span v-if="errors.desc" class="error-message">{{ errors.desc }}</span>
                </div>

                <!-- Specifications -->
                <div class="specifications-section">
                    <h3 class="section-title">Specifications</h3>

                    <div class="form-group">
                        <label class="form-label">Dimensions</label>
                        <input v-model="form.dimensions" type="text" class="form-input"
                            placeholder="Enter dimensions (e.g., 10&quot; x 5&quot; x 3&quot;)" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Material</label>
                        <input v-model="form.material" type="text" class="form-input"
                            placeholder="Enter material (e.g., Porcelain, Stoneware)" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Weight</label>
                        <input v-model="form.weight" type="text" class="form-input"
                            placeholder="Enter weight (e.g., 2.5 lbs)" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Capacity</label>
                        <input v-model="form.capacity" type="text" class="form-input"
                            placeholder="Enter capacity (e.g., 16 oz, 500ml)" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Care Instructions</label>
                        <textarea v-model="form.care_instructions" class="form-textarea"
                            placeholder="Enter care instructions (e.g., Dishwasher safe, Hand wash only)"
                            rows="3"></textarea>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="form-actions">
                    <button type="button" @click="handleCancel" class="btn btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-save" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ProductAPI, type CreateProductRequest } from '../services/product'
import { handleAPIError, HTTP_STATUS } from '../services/auth'
import { notification } from '../utils/notification'

const router = useRouter()

// Form data
const form = reactive({
    name: '',
    category: '',
    price: '',
    stock: '',
    pic_info: '',
    desc: '',
    dimensions: '',
    material: '',
    weight: '',
    capacity: '',
    care_instructions: ''
})

// Form validation errors
const errors = reactive({
    name: '',
    category: '',
    price: '',
    stock: '',
    desc: ''
})

// Form state
const isSubmitting = ref(false)

// Form validation
const validateForm = () => {
    let isValid = true

    // Reset errors
    Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
    })

    // Product name validation
    if (!form.name.trim()) {
        errors.name = 'Product name is required'
        isValid = false
    }

    // Category validation
    if (!form.category) {
        errors.category = 'Category is required'
        isValid = false
    }

    // Price validation
    if (!form.price || parseFloat(form.price) <= 0) {
        errors.price = 'Valid price is required'
        isValid = false
    }

    // Stock validation
    if (!form.stock || parseInt(form.stock) < 0) {
        errors.stock = 'Valid stock quantity is required'
        isValid = false
    }

    // Description validation
    if (!form.desc.trim()) {
        errors.desc = 'Product description is required'
        isValid = false
    }

    return isValid
}

// Form handlers
const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }

    isSubmitting.value = true

    try {
        // 准备产品数据 - 根据新API文档格式
        const productData: CreateProductRequest = {
            name: form.name,
            category: form.category,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
            desc: form.desc,
            pic_info: form.pic_info || undefined,
            dimensions: form.dimensions || undefined,
            material: form.material || undefined,
            weight: form.weight || undefined,
            capacity: form.capacity || undefined,
            care_instructions: form.care_instructions || undefined
        }

        // 调用API创建产品
        const response = await ProductAPI.addProduct(productData)

        if (response.code === HTTP_STATUS.OK) {
            notification.success('Product created successfully!', 'Success')
            // 延迟跳转，让用户看到成功消息
            setTimeout(() => {
                router.push('/products')
            }, 1500)
        } else {
            notification.error(handleAPIError(response, 'Failed to create product'), 'Error')
        }

    } catch (error) {
        console.error('Error creating product:', error)
        notification.error('Network error, please try again later', 'Connection Error')
    } finally {
        isSubmitting.value = false
    }
}

const handleCancel = () => {
    router.back()
}
</script>

<style scoped>
.add-product-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
    background: #f8f9fb;
    min-height: 100vh;
}

.header {
    margin-bottom: 32px;
}

.breadcrumb {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 8px;
}

.breadcrumb .divider {
    margin: 0 8px;
}

.breadcrumb .current {
    color: #334155;
    font-weight: 500;
}

.header h1 {
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

.form-container {
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-row {
    display: flex;
    gap: 16px;
}

.half-width {
    flex: 1;
}

.form-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}

.form-label.required::after {
    content: ' *';
    color: #ef4444;
}

.form-input,
.form-select,
.form-textarea {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
    border-color: #ef4444;
}

.price-input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.currency-symbol {
    position: absolute;
    left: 16px;
    color: #6b7280;
    font-weight: 500;
    z-index: 1;
}

.price-input {
    padding-left: 40px;
}

.stock-input {
    max-width: 200px;
}

.upload-container {
    width: 100%;
}

.upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #f9fafb;
}

.upload-area:hover {
    border-color: #3b82f6;
    background: #eff6ff;
}

.upload-area.dragover {
    border-color: #3b82f6;
    background: #eff6ff;
}

.upload-area.has-image {
    padding: 0;
    border: none;
    background: transparent;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.upload-icon {
    color: #9ca3af;
}

.upload-text {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
}

.select-file-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.select-file-btn:hover {
    background: #2563eb;
}

.image-preview {
    position: relative;
    display: inline-block;
    border-radius: 12px;
    overflow: hidden;
}

.preview-img {
    max-width: 100%;
    max-height: 300px;
    width: auto;
    height: auto;
    display: block;
}

.remove-image-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.remove-image-btn:hover {
    background: rgba(0, 0, 0, 0.9);
}

.file-input {
    display: none;
}

.image-preview-small {
    margin-top: 12px;
    max-width: 200px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

.image-preview-small img {
    width: 100%;
    height: auto;
    display: block;
}

.specifications-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 24px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 24px 0;
}

.form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    border-top: 1px solid #e5e7eb;
    padding-top: 24px;
    margin-top: 32px;
}

.btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-cancel {
    background: #f3f4f6;
    color: #374151;
}

.btn-cancel:hover {
    background: #e5e7eb;
}

.btn-save {
    background: #dc6643;
    color: white;
}

.btn-save:hover:not(:disabled) {
    background: #c55a3a;
}

.btn-save:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.error-message {
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
}

@media (max-width: 768px) {
    .add-product-container {
        padding: 16px;
    }

    .form-container {
        padding: 24px 16px;
    }

    .form-row {
        flex-direction: column;
        gap: 24px;
    }

    .form-actions {
        flex-direction: column-reverse;
    }

    .btn {
        width: 100%;
    }
}
</style>