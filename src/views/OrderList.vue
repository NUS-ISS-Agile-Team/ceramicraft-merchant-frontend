<template>
  <div class="order-management">
    <!-- Header -->
    <div class="header">
      <h1 class="title">Order Management</h1>
      <p class="subtitle">View and manage your store orders</p>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <div class="filter-item">
          <label>Status:</label>
          <select v-model="filters.status" class="select">
            <option value="all">all</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div class="filter-item">
          <button class="date-range-btn">
            <span class="icon">📅</span>
            Date Range
          </button>
        </div>
      </div>

      <button class="more-filters-btn">
        <span class="icon">⚙</span>
        More Filters
      </button>
    </div>

    <!-- Orders Table -->
    <div class="table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>BUYER</th>
            <th>DATE</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td class="order-id">{{ order.id }}</td>
            <td>
              <div class="buyer-info">
                <div class="buyer-name">{{ order.buyer.name }}</div>
                <div class="buyer-email">{{ order.buyer.email }}</div>
              </div>
            </td>
            <td>{{ order.date }}</td>
            <td class="amount">{{ order.amount }}</td>
            <td>
              <span :class="['status-badge', `status-${order.status.toLowerCase()}`]">
                {{ order.status }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-secondary" @click="viewDetails(order.id)">
                  View Details
                </button>
                <button 
                  v-if="order.status === 'Paid'" 
                  class="btn btn-primary" 
                  @click="shipOrder(order.id)"
                >
                  Ship Order
                </button>
                <button 
                  v-if="order.status === 'Paid'" 
                  class="btn btn-danger" 
                  @click="cancelOrder(order.id)"
                >
                  Cancel Order
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="results-info">
        Showing {{ startIndex }} to {{ endIndex }} of {{ totalResults }} results
      </div>

      <div class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          &lt; Previous
        </button>
        <button 
          v-for="page in visiblePages" 
          :key="page"
          :class="['pagination-btn', { active: page === currentPage }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button 
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 6,
      totalResults: 56,
      filters: {
        status: 'all',
        dateRange: null
      },
      orders: [
        {
          id: '#ORD-12345',
          buyer: { name: 'John Smith', email: 'john.smith@example.com' },
          date: 'May 21, 2023',
          amount: '$245.99',
          status: 'Paid'
        },
        {
          id: '#ORD-12344',
          buyer: { name: 'Sarah Johnson', email: 'sarah.j@example.com' },
          date: 'May 20, 2023',
          amount: '$189.50',
          status: 'Shipped'
        },
        {
          id: '#ORD-12343',
          buyer: { name: 'Michael Brown', email: 'mbrown@example.com' },
          date: 'May 19, 2023',
          amount: '$325.00',
          status: 'Paid'
        },
        {
          id: '#ORD-12342',
          buyer: { name: 'Emily Davis', email: 'emily.davis@example.com' },
          date: 'May 18, 2023',
          amount: '$78.25',
          status: 'Cancelled'
        },
        {
          id: '#ORD-12341',
          buyer: { name: 'Robert Wilson', email: 'rwilson@example.com' },
          date: 'May 17, 2023',
          amount: '$159.99',
          status: 'Shipped'
        },
        {
          id: '#ORD-12340',
          buyer: { name: 'Jessica Martinez', email: 'jmartinez@example.com' },
          date: 'May 16, 2023',
          amount: '$210.75',
          status: 'Paid'
        }
      ]
    };
  },
  computed: {
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.orders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.totalResults / this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endIndex() {
      const end = this.currentPage * this.itemsPerPage;
      return end > this.totalResults ? this.totalResults : end;
    },
    visiblePages() {
      const pages = [];
      for (let i = 1; i <= Math.min(3, this.totalPages); i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
        
    viewDetails(orderId) {
        console.log('clicked', orderId)
        this.$router.push({ name: 'OrderDetail', params: { id: orderId } })
    },

    shipOrder(orderId) {
      console.log('Ship order:', orderId);
      // Implement ship order logic
      // 可以添加确认对话框和API调用
      if (confirm('Are you sure you want to ship this order?')) {
        // API call to ship order
        alert(`Order ${orderId} has been marked as shipped`);
      }
    },
    cancelOrder(orderId) {
      console.log('Cancel order:', orderId);
      // Implement cancel order logic
      if (confirm('Are you sure you want to cancel this order?')) {
        // API call to cancel order
        alert(`Order ${orderId} has been cancelled`);
      }
    }
  }
};
</script>

<style scoped>
.order-management {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  margin-bottom: 24px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.select {
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  outline: none;
}

.date-range-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
}

.more-filters-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
}

.icon {
  font-size: 16px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead {
  background-color: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}

.orders-table th {
  text-align: left;
  padding: 16px 20px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.orders-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.orders-table tbody tr:hover {
  background-color: #fafafa;
}

.orders-table td {
  padding: 20px;
  font-size: 14px;
  color: #1a1a1a;
}

.order-id {
  font-weight: 500;
  color: #1a1a1a;
}

.buyer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.buyer-name {
  font-weight: 500;
  color: #1a1a1a;
}

.buyer-email {
  font-size: 13px;
  color: #666;
}

.amount {
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-paid {
  background-color: #fef3c7;
  color: #92400e;
}

.status-shipped {
  background-color: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-secondary {
  background: white;
  border: 1px solid #e0e0e0;
  color: #1a1a1a;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.btn-primary {
  background: #dc6b3d;
  color: white;
}

.btn-primary:hover {
  background: #c55a2f;
}

.btn-danger {
  background: #dc6b3d;
  color: white;
}

.btn-danger:hover {
  background: #c55a2f;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.results-info {
  font-size: 14px;
  color: #666;
}

.pagination {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.pagination-btn.active {
  background: #dc6b3d;
  color: white;
  border-color: #dc6b3d;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>