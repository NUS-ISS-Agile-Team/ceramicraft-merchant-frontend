<template>
  <div class="order-detail-page">
    <!-- 页面顶部导航 -->
    <div class="page-header">
      <button @click="goBack" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5"/>
          <path d="M12 19l-7-7 7-7"/>
        </svg>
        Back to Order List
      </button>
      <h1 class="page-title">Order Details</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <svg class="loading-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
          <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </div>
      <p>Loading order details...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <p class="error-message">{{ error }}</p>
      <button @click="loadOrderDetail" class="btn-primary">Reload</button>
    </div>

    <!-- 订单详情内容 -->
    <div v-else-if="orderDetail" class="order-content">
      <!-- 第一行：订单基本信息 + 收货信息 -->
      <div class="panel-row">
        <!-- 订单基本信息面板 -->
        <div class="info-panel">
          <div class="panel-header">
            <h2>Order Information</h2>
            <div class="order-status">
              <span :class="['status-badge', OrderAPI.getStatusClass(orderDetail.status_name)]">
                {{ OrderAPI.getStatusName(orderDetail.status_name) }}
              </span>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <label>Order Number</label>
              <span class="order-no">{{ orderDetail.order_no }}</span>
            </div>
            <div class="info-item">
              <label>Customer ID</label>
              <span>{{ orderDetail.user_id }}</span>
            </div>
            <div class="info-item">
              <label>Create Time</label>
              <span>{{ OrderAPI.formatDate(orderDetail.create_time) }}</span>
            </div>
            <div class="info-item">
              <label>Payment Time</label>
              <span>{{ OrderAPI.formatDate(orderDetail.pay_time) }}</span>
            </div>
            <div class="info-item">
              <label>Delivery Time</label>
              <span>{{ OrderAPI.formatDate(orderDetail.delivery_time) }}</span>
            </div>
            <div class="info-item">
              <label>Tracking Number</label>
              <span>{{ orderDetail.logistics_no || '-' }}</span>
            </div>
            <div class="info-item full-width">
              <label>Remark</label>
              <span>{{ orderDetail.remark || 'None' }}</span>
            </div>
          </div>
        </div>

        <!-- 收货信息面板 -->
        <div class="info-panel">
          <div class="panel-header">
            <h2>Shipping Information</h2>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <label>Receiver</label>
              <span>{{ orderDetail.receiver_last_name }}{{ orderDetail.receiver_first_name }}</span>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <span>{{ orderDetail.receiver_phone }}</span>
            </div>
            <div class="info-item">
              <label>Country/Region</label>
              <span>{{ orderDetail.receiver_country }}</span>
            </div>
            <div class="info-item">
              <label>Postal Code</label>
              <span>{{ orderDetail.receiver_zip_code }}</span>
            </div>
            <div class="info-item full-width">
              <label>Address</label>
              <span>{{ orderDetail.receiver_address }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 第二行：订单商品 + 订单金额 -->
      <div class="panel-row">
        <!-- 订单商品表格 -->
        <div class="items-panel">
          <div class="panel-header">
            <h2>Order Items</h2>
            <span class="items-count">{{ orderDetail.order_items.length }} items total</span>
          </div>

          <div class="items-table-container">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in orderDetail.order_items" :key="item.id" class="item-row">
                  <td class="product-id">{{ item.product_id }}</td>
                  <td class="product-name">{{ item.product_name }}</td>
                  <td class="price">¥{{ OrderAPI.formatAmount(item.price) }}</td>
                  <td class="quantity">{{ item.quantity }}</td>
                  <td class="total-price">¥{{ OrderAPI.formatAmount(item.total_price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 订单金额汇总 -->
        <div class="summary-panel">
          <div class="panel-header">
            <h2>Order Amount</h2>
          </div>

          <div class="summary-grid">
            <div class="summary-row">
              <span class="summary-label">Items Total</span>
              <span class="summary-value">¥{{ OrderAPI.formatAmount(getItemsTotal()) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Shipping Fee</span>
              <span class="summary-value">¥{{ OrderAPI.formatAmount(orderDetail.shipping_fee) }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Tax</span>
              <span class="summary-value">¥{{ OrderAPI.formatAmount(orderDetail.tax) }}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">Order Total</span>
              <span class="summary-value">¥{{ OrderAPI.formatAmount(orderDetail.total_amount) }}</span>
            </div>
            <div v-if="orderDetail.pay_amount > 0" class="summary-row">
              <span class="summary-label">Amount Paid</span>
              <span class="summary-value paid">¥{{ OrderAPI.formatAmount(orderDetail.pay_amount) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 状态时间线 -->
      <div v-if="orderDetail.status_logs && orderDetail.status_logs.length > 0" class="timeline-panel">
        <div class="panel-header">
          <h2>Status History</h2>
        </div>

        <div class="timeline-container">
          <div v-for="(log, index) in orderDetail.status_logs" :key="log.id" class="timeline-item">
            <div class="timeline-marker">
              <div class="timeline-dot"></div>
              <div v-if="index < orderDetail.status_logs.length - 1" class="timeline-line"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-status">{{ log.status_name }}</div>
              <div class="timeline-time">{{ OrderAPI.formatDate(log.create_time) }}</div>
              <div v-if="log.remark" class="timeline-remark">{{ log.remark }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="actions-panel">
        <div class="actions-grid">
          <button 
            v-if="canUpdateStatus" 
            @click="showUpdateStatusDialog = true" 
            class="btn-primary"
          >
            Update Order Status
          </button>
          <button @click="printOrder" class="btn-secondary">
            Print Order
          </button>
          <button @click="exportOrder" class="btn-secondary">
            Export Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { OrderAPI, OrderStatus, type OrderDetail } from '../services/order'

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const error = ref('')
const orderDetail = ref<OrderDetail | null>(null)
const showUpdateStatusDialog = ref(false)

// 计算属性
const canUpdateStatus = computed(() => {
  if (!orderDetail.value) return false
  // 根据当前状态判断是否可以更新状态
  const currentStatus = orderDetail.value.status
  return currentStatus !== OrderStatus.CONFIRMED && currentStatus !== OrderStatus.CANCELLED
})

// 方法
const loadOrderDetail = async () => {
  const orderNo = route.params.orderNo as string
  if (!orderNo) {
    error.value = 'Invalid order number parameter'
    return
  }

  try {
    loading.value = true
    error.value = ''

    const response = await OrderAPI.getOrderDetail(orderNo)

    if (OrderAPI.isSuccess(response) && response.data) {
      orderDetail.value = response.data
    } else {
      throw new Error(response.error || 'Failed to fetch order details')
    }
  } catch (err) {
    console.error('Failed to load order detail:', err)
    error.value = err instanceof Error ? err.message : 'Network error, please try again later'
  } finally {
    loading.value = false
  }
}

const getItemsTotal = (): number => {
  if (!orderDetail.value) return 0
  return orderDetail.value.order_items.reduce((total, item) => total + item.total_price, 0)
}

const goBack = () => {
  router.push('/orders')
}

const printOrder = () => {
  window.print()
}

const exportOrder = () => {
  // 这里可以实现导出功能
  console.log('Export order:', orderDetail.value?.order_no)
}

// 生命周期
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped>
.order-detail-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #e5e7eb;
}

.back-btn svg {
  width: 16px;
  height: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

/* 状态样式 */
.loading-state, .error-state {
  padding: 64px 24px;
  text-align: center;
}

.loading-spinner, .error-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #9ca3af;
}

.loading-icon {
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message {
  color: #dc2626;
  font-size: 16px;
  margin-bottom: 16px;
}

/* 面板样式 */
.panel-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.info-panel, .items-panel, .summary-panel, .timeline-panel, .actions-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 让商品面板占用更多空间 */
.panel-row .items-panel {
  grid-column: 1;
}

.panel-row .summary-panel {
  grid-column: 2;
}

/* 单独的面板（状态历史和操作按钮） */
.timeline-panel, .actions-panel {
  margin-bottom: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.order-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-created { background: #fef3c7; color: #92400e; }
.status-paid { background: #dbeafe; color: #1e40af; }
.status-shipped { background: #e0e7ff; color: #3730a3; }
.status-delivered { background: #d1fae5; color: #065f46; }
.status-confirmed { background: #dcfce7; color: #166534; }
.status-cancelled { background: #fecaca; color: #991b1b; }
.status-unknown { background: #f3f4f6; color: #374151; }

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.info-item span {
  font-size: 16px;
  color: #1f2937;
}

.order-no {
  font-family: monospace;
  color: #3b82f6;
  font-weight: 500;
}

/* 商品表格 */
.items-count {
  font-size: 14px;
  color: #6b7280;
}

.items-table-container {
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.items-table th,
.items-table td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.items-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  white-space: nowrap;
}

.items-table td {
  font-size: 13px;
  color: #1f2937;
}

.item-row:hover {
  background: #f9fafb;
}

.product-id {
  font-family: monospace;
  color: #3b82f6;
  font-size: 12px;
}

.product-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price, .total-price {
  font-weight: 600;
  color: #059669;
  white-space: nowrap;
}

.quantity {
  text-align: center;
}

/* 金额汇总 */
.summary-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.summary-row.total {
  border-top: 2px solid #e5e7eb;
  margin-top: 8px;
  padding-top: 16px;
  font-weight: 600;
  font-size: 16px;
}

.summary-label {
  color: #6b7280;
}

.summary-value {
  color: #1f2937;
  font-weight: 500;
}

.summary-value.paid {
  color: #059669;
  font-weight: 600;
}

/* 时间线 */
.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #3b82f6;
}

.timeline-line {
  width: 2px;
  height: 40px;
  background: #e5e7eb;
  margin-top: 8px;
}

.timeline-content {
  flex: 1;
  padding-bottom: 16px;
}

.timeline-status {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.timeline-time {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.timeline-remark {
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  padding: 8px 12px;
  border-radius: 6px;
}

/* 操作按钮 */
.actions-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
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

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* 响应式样式 */
@media (max-width: 1024px) {
  .panel-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .panel-row .items-panel,
  .panel-row .summary-panel {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .order-detail-page {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .panel-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .items-table {
    font-size: 12px;
  }
  
  .items-table th,
  .items-table td {
    padding: 8px 6px;
  }
  
  .product-name {
    max-width: 100px;
  }
  
  .actions-grid {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}

/* 打印样式 */
@media print {
  .page-header,
  .actions-panel {
    display: none;
  }
  
  .order-detail-page {
    padding: 0;
  }
  
  .info-panel, .items-panel, .summary-panel, .timeline-panel {
    box-shadow: none;
    border: 1px solid #e5e7eb;
    margin-bottom: 16px;
  }
}</style>