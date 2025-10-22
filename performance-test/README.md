# Product API Performance Test 使用指南

## 📋 测试概述

**测试目标**: 测试 CeramiCraft 商品 API 的性能
**测试 API**:
- GET `/product-ms/v1/customer/products` (商品列表)
- GET `/product-ms/v1/customer/product/{id}` (商品详情)

**服务器地址**: http://47.129.72.211

---

## 🚀 快速开始

### 1. 打开 JMeter
- 找到 JMeter 安装目录
- 双击 `jmeter.bat` (Windows) 或运行 `jmeter` (Mac/Linux)

### 2. 导入测试计划
1. 在 JMeter 中,点击 `File` → `Open`
2. 选择 `Product_API_Performance_Test.jmx`
3. 测试计划会自动加载

### 3. 配置测试参数

#### 当前配置:
- **线程数 (用户数)**: 50 个并发用户
- **Ramp-Up 时间**: 10 秒 (10秒内启动50个用户)
- **循环次数**: 10 次 (每个用户请求10次)
- **总请求数**: 50 × 10 × 2 = 1000 次请求

#### 如何修改:
1. 点击左侧树形结构中的 `Product List API - Load Test`
2. 修改参数:
   - `Number of Threads (users)`: 并发用户数
   - `Ramp-Up Period (seconds)`: 启动时间
   - `Loop Count`: 循环次数

---

## 📊 运行测试

### 步骤:
1. 点击顶部菜单栏的 **绿色播放按钮** ▶️
2. 或者点击 `Run` → `Start`
3. 等待测试完成 (进度条显示在右上角)

### 需要截图的地方:

#### 1️⃣ **汇总报告** (Summary Report)
- 点击左侧 `汇总报告`
- 显示内容:
  - ✅ **Samples**: 总请求数
  - ✅ **Average**: 平均响应时间 (ms)
  - ✅ **Min/Max**: 最小/最大响应时间
  - ✅ **Throughput**: 吞吐量 (QPS - 每秒请求数)
  - ✅ **Error %**: 错误率

📸 **截图这个表格!**

#### 2️⃣ **图形结果** (Graph Results)
- 点击左侧 `图形结果`
- 显示响应时间趋势图

📸 **截图这个图表!**

#### 3️⃣ **用表格察看结果** (View Results in Table)
- 点击左侧 `用表格察看结果`
- 显示每个请求的详细结果

📸 **截图这个表格!**

---

## 🔬 需要记录的关键指标

### 从 JMeter 汇总报告中获取:

1. **最大并发数 (Max Concurrency)**
   - 配置的线程数: `50 个用户`

2. **最高 QPS (Queries Per Second)**
   - 查看 `Throughput` 列
   - 例如: `120.5/sec` = 每秒120.5个请求

3. **平均延迟 (Average Latency)**
   - 查看 `Average` 列
   - 例如: `350 ms`

4. **错误率 (Error Rate)**
   - 查看 `Error %` 列
   - 应该是 `0.00%`

---

## 📈 Prometheus 监控

### 访问 Prometheus:
1. 打开浏览器
2. 访问 Prometheus 地址 (询问后端同事)
   - 通常是: `http://服务器IP:9090`

### 需要查看的指标:

#### 在 Prometheus 中输入以下查询:

1. **CPU 使用率**:
   ```
   rate(process_cpu_seconds_total[1m])
   ```

2. **内存使用**:
   ```
   process_resident_memory_bytes
   ```

3. **HTTP 请求数**:
   ```
   rate(http_requests_total[1m])
   ```

4. **HTTP 响应时间**:
   ```
   http_request_duration_seconds
   ```

📸 **截图每个指标的图表!**

---

## 📝 测试场景建议

### 场景 1: 轻负载测试
- 用户数: 10
- Ramp-Up: 5秒
- 循环: 5次

### 场景 2: 中负载测试
- 用户数: 50
- Ramp-Up: 10秒
- 循环: 10次

### 场景 3: 高负载测试
- 用户数: 100
- Ramp-Up: 20秒
- 循环: 20次

### 场景 4: 压力测试 (找到极限)
- 用户数: 200+
- Ramp-Up: 30秒
- 循环: 30次
- 逐步增加用户数,直到出现错误

---

## 📋 分析结论模板

```markdown
# Product API Performance Test 分析报告

## 测试环境
- 服务器: http://47.129.72.211
- 测试时间: 2025-10-17
- 测试工具: Apache JMeter 5.x

## 测试 API
1. GET /product-ms/v1/customer/products (商品列表)
2. GET /product-ms/v1/customer/product/{id} (商品详情)

## 测试结果

### 关键指标
- **最大并发数**: 50 用户
- **最高 QPS**: XXX 请求/秒
- **平均延迟**: XXX ms
- **最小延迟**: XXX ms
- **最大延迟**: XXX ms
- **错误率**: X.XX%
- **成功率**: XX.XX%

### 服务器资源使用 (Prometheus)
- **CPU 使用率**: XX%
- **内存使用**: XXX MB
- **网络吞吐量**: XXX KB/s

## 分析结论

### 性能表现
✅ **优秀**: 平均响应时间 < 200ms
⚠️ **良好**: 平均响应时间 200-500ms
❌ **需要优化**: 平均响应时间 > 500ms

### 瓶颈分析
- [ ] 数据库查询慢
- [ ] CPU 资源不足
- [ ] 内存不足
- [ ] 网络带宽限制

### 优化建议
1. 添加缓存 (Redis)
2. 优化数据库查询
3. 增加服务器资源
4. 使用 CDN

### 容量规划
基于测试结果,系统可以支持:
- 并发用户: XXX 人
- 每日 PV: XXX 次
- 峰值 QPS: XXX 请求/秒
```

---

## ⚠️ 注意事项

1. **不要在生产环境进行高压测试!**
2. 测试前通知后端团队
3. 测试时间选择低峰期
4. 逐步增加负载,不要一开始就用最大值
5. 保存所有截图和日志

---

## 🆘 常见问题

### Q: 测试时出现大量错误怎么办?
A: 
1. 减少并发用户数
2. 检查服务器是否正常运行
3. 查看错误详情 (点击红色的请求)

### Q: 如何停止测试?
A: 点击顶部的 **红色停止按钮** ⏹️

### Q: 如何清除之前的测试结果?
A: 点击 `Run` → `Clear All` (扫帚图标 🧹)

---

## 📞 联系后端团队

测试前需要确认:
- ✅ Prometheus 访问地址
- ✅ 测试时间窗口
- ✅ 是否需要准备特定的测试数据
- ✅ 服务器资源配置信息
