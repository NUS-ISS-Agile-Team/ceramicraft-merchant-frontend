<template>
  <div class="order-details">
    <!-- Header -->
    <div class="breadcrumb">
      <a href="#" @click.prevent="goBack" class="breadcrumb-link">Orders</a>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-current">Order Details</span>
    </div>

    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          Order {{ orderData.orderId }}
          <span :class="['status-badge', `status-${orderData.status.toLowerCase()}`]">
            {{ orderData.status }}
          </span>
        </h1>
        <p class="order-date">Placed on {{ orderData.placedDate }}</p>
      </div>

      <div class="header-actions">
        <button class="btn btn-secondary" @click="goBack">
          ← Back to Orders
        </button>
        <button class="btn btn-secondary" @click="printOrder">
          🖨️ Print
        </button>
        <button class="btn btn-secondary" @click="generateInvoice">
          📄 Generate Invoice
        </button>
      </div>
    </div>

    <div class="content-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Order Summary -->
        <div class="card">
          <h2 class="card-title">Order Summary</h2>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Order ID</span>
              <span class="info-value">{{ orderData.orderId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date Placed</span>
              <span class="info-value">{{ orderData.datePlaced }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Time</span>
              <span class="info-value">{{ orderData.time }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status</span>
              <span :class="['status-badge', `status-${orderData.status.toLowerCase()}`]">
                {{ orderData.status }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method</span>
              <span class="info-value">{{ orderData.paymentMethod }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Shipping Method</span>
              <span class="info-value">{{ orderData.shippingMethod }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="card">
          <h2 class="card-title">Customer Information</h2>
          
          <div class="customer-section">
            <h3 class="section-title">Contact Information</h3>
            <p class="customer-name">{{ customer.name }}</p>
            <p class="customer-detail">{{ customer.email }}</p>
            <p class="customer-detail">{{ customer.phone }}</p>
          </div>

          <div class="customer-section">
            <h3 class="section-title">Shipping Address</h3>
            <p class="customer-name">{{ shipping.name }}</p>
            <p class="customer-detail">{{ shipping.street }}</p>
            <p class="customer-detail">{{ shipping.apt }}</p>
            <p class="customer-detail">{{ shipping.city }}</p>
            <p class="customer-detail">{{ shipping.country }}</p>
          </div>

          <div class="customer-section">
            <h3 class="section-title">Billing Address</h3>
            <p class="customer-detail">{{ billing.sameAsShipping }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Order Items -->
        <div class="card">
          <h2 class="card-title">Order Items</h2>
          
          <div class="items-table">
            <div class="table-header">
              <div class="col-product">PRODUCT</div>
              <div class="col-id">ID</div>
              <div class="col-price">UNIT PRICE</div>
              <div class="col-quantity">QUANTITY</div>
              <div class="col-total">TOTAL</div>
            </div>

            <div 
              v-for="item in orderItems" 
              :key="item.id" 
              class="table-row"
            >
              <div class="col-product">
                <div class="product-info">
                  <img :src="item.image" :alt="item.name" class="product-image">
                  <span class="product-name">{{ item.name }}</span>
                </div>
              </div>
              <div class="col-id">{{ item.productId }}</div>
              <div class="col-price">{{ item.price }}</div>
              <div class="col-quantity">{{ item.quantity }}</div>
              <div class="col-total">{{ item.total }}</div>
            </div>
          </div>

          <div class="order-totals">
            <div class="total-row">
              <span class="total-label">Subtotal</span>
              <span class="total-value">{{ totals.subtotal }}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Shipping</span>
              <span class="total-value">{{ totals.shipping }}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Tax</span>
              <span class="total-value">{{ totals.tax }}</span>
            </div>
            <div class="total-row total-final">
              <span class="total-label">Total</span>
              <span class="total-value">{{ totals.total }}</span>
            </div>
          </div>
        </div>

        <!-- Order Timeline -->
        <div class="card">
          <h2 class="card-title">Order Timeline</h2>
          
          <div class="timeline">
            <div 
              v-for="(event, index) in timeline" 
              :key="index" 
              class="timeline-item"
            >
              <div :class="['timeline-icon', `icon-${event.type}`]">
                <span>{{ event.icon }}</span>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4 class="timeline-title">{{ event.title }}</h4>
                  <span class="timeline-date">
                    {{ event.date }}<br>{{ event.time }}
                  </span>
                </div>
                <p class="timeline-description">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Notes -->
        <div class="card">
          <h2 class="card-title">Order Notes</h2>
          
          <textarea 
            v-model="orderNotes"
            class="notes-textarea"
            placeholder="Add a note about this order..."
          ></textarea>
          
          <button class="btn btn-primary add-note-btn" @click="addNote">
            Add Note
          </button>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="footer-actions">
      <button class="btn btn-secondary" @click="cancelOrder">
        Cancel Order
      </button>
      <button class="btn btn-primary" @click="shipOrder">
        Ship Order
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetails',
  data() {
    return {
      orderNotes: '',
      orderData: {
        orderId: '#ORD-12345',
        status: 'Paid',
        placedDate: 'May 21, 2023 at 14:32 PM',
        datePlaced: 'May 21, 2023',
        time: '14:32 PM',
        paymentMethod: 'Point Card',
        shippingMethod: 'Standard Shipping'
      },
      customer: {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567'
      },
      shipping: {
        name: 'John Smith',
        street: '123 Main Street',
        apt: 'Apt 4B',
        city: 'San Francisco, CA 94103',
        country: 'United States'
      },
      billing: {
        sameAsShipping: 'Same as shipping address'
      },
      orderItems: [
        {
          id: 1,
          name: 'Handcrafted Ceramic Mug',
          productId: 'CM-1001',
          price: '$29.99',
          quantity: 3,
          total: '$89.97',
          image: 'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23E5E7EB" width="48" height="48"/%3E%3C/svg%3E'
        },
        {
          id: 2,
          name: 'Ceramic Plant Pot',
          productId: 'CP-2002',
          price: '$45.99',
          quantity: 2,
          total: '$91.98',
          image: 'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23D1FAE5" width="48" height="48"/%3E%3C/svg%3E'
        },
        {
          id: 3,
          name: 'Decorative Ceramic Plate',
          productId: 'DP-3003',
          price: '$32.99',
          quantity: 1,
          total: '$32.99',
          image: 'data:image/svg+xml,%3Csvg width="48" height="48" xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23FED7AA" width="48" height="48"/%3E%3C/svg%3E'
        }
      ],
      totals: {
        subtotal: '$214.94',
        shipping: '$9.99',
        tax: '$21.06',
        total: '$245.99'
      },
      timeline: [
        {
          type: 'placed',
          icon: '📦',
          title: 'Order Placed',
          description: 'Order #ORD-12345 was placed by customer',
          date: 'May 21, 2023',
          time: '14:32 PM'
        },
        {
          type: 'confirmed',
          icon: '💳',
          title: 'Payment Confirmed',
          description: 'Payment of $245.99 was received via Point Card',
          date: 'May 21, 2023',
          time: '14:35 PM'
        },
        {
          type: 'processing',
          icon: '⚙️',
          title: 'Processing Order',
          description: 'Order is being prepared for shipment',
          date: 'May 21, 2023',
          time: '15:20 PM'
        }
      ]
    };
  },
  methods: {
    goBack() {
      this.$router.push('/orders');
    },
    printOrder() {
      window.print();
    },
    generateInvoice() {
      console.log('Generating invoice...');
    },
    addNote() {
      if (this.orderNotes.trim()) {
        console.log('Adding note:', this.orderNotes);
        this.orderNotes = '';
      }
    },
    cancelOrder() {
      console.log('Cancelling order...');
    },
    shipOrder() {
      console.log('Shipping order...');
    }
  }
};
</script>

<style scoped>
.order-details {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.breadcrumb-link {
  color: #666;
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: #dc6b3d;
}

.breadcrumb-separator {
  color: #999;
}

.breadcrumb-current {
  color: #1a1a1a;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.order-date {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
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

.content-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.card:last-child {
  margin-bottom: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.customer-section {
  margin-bottom: 24px;
}

.customer-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.customer-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.customer-detail {
  font-size: 14px;
  color: #666;
  margin: 0 0 4px 0;
}

.items-table {
  margin-bottom: 24px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 12px 0;
}

.table-header {
  border-bottom: 2px solid #f0f0f0;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}

.product-name {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.col-id,
.col-price,
.col-quantity,
.col-total {
  font-size: 14px;
  color: #1a1a1a;
}

.order-totals {
  border-top: 2px solid #f0f0f0;
  padding-top: 16px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.total-label {
  font-size: 14px;
  color: #666;
}

.total-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.total-final {
  border-top: 2px solid #f0f0f0;
  margin-top: 8px;
  padding-top: 16px;
}

.total-final .total-label,
.total-final .total-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timeline-item {
  display: flex;
  gap: 16px;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.icon-placed {
  background-color: #dbeafe;
}

.icon-confirmed {
  background-color: #d1fae5;
}

.icon-processing {
  background-color: #fef3c7;
}

.timeline-content {
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.timeline-date {
  font-size: 12px;
  color: #666;
  text-align: right;
  line-height: 1.4;
}

.timeline-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.notes-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 12px;
}

.notes-textarea:focus {
  outline: none;
  border-color: #dc6b3d;
}

.add-note-btn {
  width: 100%;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>