<template>
  <div class="home-container">
    <section class="hero-section">
      <h1>Welcome to CERAMIC-CRAFT</h1>
      <p>Discover our handcrafted ceramic collection</p>
      <button class="shop-now-button">Shop Now</button>
    </section>
    
    <section class="featured-products">
      <h2>Featured Products</h2>
      <div class="product-grid">
        <!-- 产品卡片将在这里 -->
        <div class="product-placeholder" v-for="i in 3" :key="i">
          <div class="product-image"></div>
          <div class="product-info">
            <h3>Ceramic Product {{i}}</h3>
            <p class="price">$99.00</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  padding: 0;
  margin: 0;
}

.hero-section {
  height: 400px;
  background-color: #f5e1d0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.hero-section h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #333;
}

.hero-section p {
  font-size: 1.2em;
  margin-bottom: 30px;
  color: #555;
}

.shop-now-button {
  background-color: #c75d35;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 2px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.shop-now-button:hover {
  background-color: #b04c25;
}

.featured-products {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.featured-products h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2em;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.product-placeholder {
  background-color: #fff;
  border: 1px solid #eee;
  padding: 10px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-placeholder:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.product-image {
  height: 250px;
  background-color: #f8f8f8;
  margin-bottom: 15px;
}

.product-info {
  padding: 10px;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 1.2em;
}

.price {
  color: #c75d35;
  font-weight: 600;
  font-size: 1.1em;
}
</style>
