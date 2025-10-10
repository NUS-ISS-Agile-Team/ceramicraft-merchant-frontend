<template>
  <div class="dashboard">
    <h1 class="page-title">Dashboard</h1>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-main">
            <div class="stat-value">$24,987</div>
            <div class="stat-label">Total Sales</div>
          </div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            12.5%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-main">
            <div class="stat-value">1,482</div>
            <div class="stat-label">Total Orders</div>
          </div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            8.2%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-main">
            <div class="stat-value">$16.85</div>
            <div class="stat-label">Average Order</div>
          </div>
          <div class="stat-change negative">
            <i class="fas fa-arrow-down"></i>
            2.4%
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-main">
            <div class="stat-value">953</div>
            <div class="stat-label">Total Customers</div>
          </div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            4.6%
          </div>
        </div>
      </div>
    </div>

    <!-- 最近销售表格 -->
    <div class="sales-section">
      <div class="section-header">
        <h2 class="section-title">Recent Sales</h2>
        <button class="view-all-btn">View All</button>
      </div>

      <div class="table-container">
        <table class="sales-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>PRODUCT</th>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in recentSales" :key="sale.id">
              <td class="order-id">{{ sale.id }}</td>
              <td>
                <div class="customer-cell">
                  <div class="cust-name">{{ sale.customer }}</div>
                  <div class="cust-phone">{{ sale.phone }}</div>
                </div>
              </td>
              <td>{{ sale.product || '—' }}</td>
              <td class="date">{{ sale.date }}</td>
              <td class="amount">{{ sale.amount }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(sale.status)]">
                  {{ sale.status || '—' }}
                </span>
              </td>
              <td>
                <button class="action-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Sale {
  id: string
  customer: string
  product: string
  date: string
  amount: string
  status: string
  phone?: string
}

const recentSales = ref<Sale[]>([])
const loading = ref(false)
const errorMsg = ref('')

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Shipped':
      return 'status-shipped'
    case 'Paid':
      return 'status-paid'
    case 'Delivered':
      return 'status-delivered'
    default:
      return ''
  }
}

// Load recent orders from backend on mount
onMounted(async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const { OrderAPI } = await import('../services/order')
    const resp = await OrderAPI.fetchMerchantOrders({ limit: 5, offset: 0 })
    console.debug('Home fetchMerchantOrders response:', resp)

    let list: any[] = []
    if (resp && typeof resp === 'object') {
      if (Array.isArray(resp.data?.orders)) list = resp.data.orders
      else if (Array.isArray(resp.orders)) list = resp.orders
      else if (Array.isArray(resp.data)) list = resp.data
      else if (Array.isArray(resp)) list = resp
    }

    recentSales.value = list.map((o) => {
      const id = o.order_no ?? o.id ?? ''
      const customerName = [o.receiver_first_name, o.receiver_last_name].filter(Boolean).join(' ') || (o.user_name ?? o.buyer?.name ?? '—')
      const phone = o.receiver_phone ?? o.buyer?.phone ?? ''
      const product = o.product_snapshot?.name ?? o.product_name ?? '—'
      const created = o.create_time ?? o.created_at ?? o.create_time ?? o.create_time
      const date = created ? new Date(created).toLocaleString() : '—'
      // total_amount is in cents (e.g. 8430 => $84.30)
      let amount = '—'
      if (typeof o.total_amount === 'number') {
        amount = `$${(o.total_amount / 100).toFixed(2)}`
      } else if (typeof o.total_amount === 'string') {
        amount = o.total_amount
      } else if (o.total_price) {
        amount = `$${(o.total_price / 100).toFixed(2)}`
      }

      const status = o.status ?? (o.order_status != null ? ['已创建','已支付','已确认','已发货','已完成','已取消'][o.order_status] : '—')

      return {
        id,
        customer: customerName,
        phone,
        product,
        date,
        amount,
        status
      }
    })
  } catch (err: any) {
    console.error('Failed loading recent orders:', err)
    errorMsg.value = err?.message || 'Failed to load recent orders'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard {
  width: 100%;
  padding: 24px 32px;
  background: #f8f9fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px 24px;
  border: 1px solid #e5e7eb;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-main {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 400;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 0;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-change i {
  font-size: 10px;
}

/* 销售部分 */
.sales-section {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.view-all-btn {
  background: none;
  border: none;
  color: #ea6844;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.view-all-btn:hover {
  color: #d9603d;
}

/* 表格 */
.table-container {
  overflow-x: auto;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
}

.sales-table thead {
  background: #f9fafb;
}

.sales-table th {
  padding: 12px 24px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sales-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.sales-table tbody tr:hover {
  background: #f9fafb;
}

.sales-table tbody tr:last-child {
  border-bottom: none;
}

.sales-table td {
  padding: 16px 24px;
  font-size: 14px;
  color: #4b5563;
}

.order-id {
  font-weight: 600;
  color: #1a1a1a;
}

.date {
  color: #6b7280;
}

.amount {
  font-weight: 600;
  color: #1a1a1a;
}

/* 状态徽章 */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.status-shipped {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.status-paid {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-delivered {
  background: #d1fae5;
  color: #065f46;
}

/* 操作按钮 */
.action-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #4b5563;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 16px 20px;
  }

  .section-header {
    padding: 16px 20px;
  }

  .sales-table th,
  .sales-table td {
    padding: 12px 16px;
    font-size: 13px;
  }

  .stat-value {
    font-size: 24px;
  }
}

@media (max-width: 640px) {
  .table-container {
    overflow-x: scroll;
  }

  .sales-table {
    min-width: 800px;
  }
}
</style>