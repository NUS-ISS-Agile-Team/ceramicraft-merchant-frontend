# 🚀 Performance Test Quick Start Checklist

## 📋 测试前准备 (Pre-Test)

### 1. 工具准备
- [ ] JMeter 已安装并可以启动
- [ ] 导入测试计划文件 `Product_API_Performance_Test.jmx`
- [ ] 确认可以访问服务器 http://47.129.72.211

### 2. 团队沟通
- [ ] 通知后端团队测试时间
- [ ] 获取 Prometheus 访问地址: `http://_______________`
- [ ] 确认测试不会影响生产环境
- [ ] 了解服务器配置 (CPU/内存/数据库)

### 3. 测试环境检查
- [ ] 服务器正常运行
- [ ] API 可以正常访问 (手动测试一次)
- [ ] Prometheus 可以正常访问

---

## 🧪 执行测试 (During Test)

### Step 1: 轻量级测试 (10 用户)
- [ ] 修改线程数为 10
- [ ] 运行测试
- [ ] 记录结果
- [ ] 截图 JMeter 汇总报告
- [ ] 检查是否有错误

### Step 2: 中等负载测试 (50 用户) ⭐ 主要测试
- [ ] 修改线程数为 50
- [ ] 清除之前的结果 (`Run` → `Clear All`)
- [ ] 运行测试
- [ ] **截图 1**: JMeter 汇总报告 📸
- [ ] **截图 2**: JMeter 图形结果 📸
- [ ] **截图 3**: JMeter 聚合报告 📸

### Step 3: Prometheus 监控
- [ ] 打开 Prometheus 网页
- [ ] 查询 CPU 使用率
- [ ] **截图 4**: CPU 使用率图表 📸
- [ ] 查询内存使用
- [ ] **截图 5**: 内存使用图表 📸
- [ ] 查询 HTTP 请求数
- [ ] **截图 6**: HTTP 请求数图表 📸
- [ ] 查询 HTTP 响应时间
- [ ] **截图 7**: HTTP 响应时间图表 📸

### Step 4: 高负载测试 (100 用户) - 可选
- [ ] 修改线程数为 100
- [ ] 清除之前的结果
- [ ] 运行测试
- [ ] 记录结果
- [ ] 对比与 50 用户的差异

---

## 📊 数据收集 (Data Collection)

### 从 JMeter 汇总报告中记录:

#### Product List API (`/customer/products`)
- [ ] Average: _______ ms
- [ ] Min: _______ ms
- [ ] Max: _______ ms
- [ ] Throughput: _______ req/s
- [ ] Error %: _______ %

#### Product Detail API (`/customer/product/1`)
- [ ] Average: _______ ms
- [ ] Min: _______ ms
- [ ] Max: _______ ms
- [ ] Throughput: _______ req/s
- [ ] Error %: _______ %

### 从 Prometheus 记录:

#### 系统资源
- [ ] 测试前 CPU: _______ %
- [ ] 测试中 CPU (峰值): _______ %
- [ ] 测试前内存: _______ MB
- [ ] 测试中内存 (峰值): _______ MB

---

## 📝 分析报告 (Analysis)

### 1. 填写报告模板
- [ ] 打开 `Performance_Test_Report_Template.md`
- [ ] 填写所有数据
- [ ] 完成性能分析部分
- [ ] 给出优化建议

### 2. 计算关键指标
- [ ] **最大并发数**: 50 用户
- [ ] **最高 QPS**: _______ req/s (从 Throughput 获取)
- [ ] **平均延迟**: _______ ms (从 Average 获取)
- [ ] **错误率**: _______ % (从 Error % 获取)

### 3. 性能评级
- [ ] 平均响应时间 < 200ms = 优秀 ⭐⭐⭐
- [ ] 平均响应时间 200-500ms = 良好 ⭐⭐
- [ ] 平均响应时间 > 500ms = 需要优化 ⭐

---

## 📸 截图清单 (必须)

确保所有截图包含时间戳和完整的指标数据:

### JMeter 截图 (客户端)
1. [ ] 汇总报告 - 显示所有 API 的统计数据
2. [ ] 图形结果 - 显示响应时间趋势
3. [ ] 聚合报告 - 显示详细的百分位数据

### Prometheus 截图 (服务端)
4. [ ] CPU 使用率 - 包含时间轴和峰值
5. [ ] 内存使用 - 包含时间轴和峰值
6. [ ] HTTP 请求数 - 包含 QPS 数据
7. [ ] HTTP 响应时间 - 包含平均响应时间

### 截图命名建议:
```
1_jmeter_summary_report.png
2_jmeter_graph_results.png
3_jmeter_aggregate_report.png
4_prometheus_cpu_usage.png
5_prometheus_memory_usage.png
6_prometheus_http_requests.png
7_prometheus_http_latency.png
```

---

## ✅ 测试完成检查

### 数据完整性
- [ ] 所有 7 张截图已保存
- [ ] 报告模板已填写完整
- [ ] 关键指标已计算并记录
- [ ] 优化建议已给出

### 团队沟通
- [ ] 通知后端团队测试完成
- [ ] 分享测试报告给团队
- [ ] 讨论优化方案
- [ ] 计划下一步行动

---

## 🆘 常见问题速查

### Q: JMeter 显示大量错误?
**A**: 
1. 检查服务器是否在线
2. 减少并发用户数到 10
3. 检查 API 地址是否正确
4. 查看具体错误信息 (点击红色请求)

### Q: Prometheus 打不开?
**A**: 
1. 询问后端同事正确的访问地址
2. 确认是否需要 VPN
3. 确认是否需要登录凭证

### Q: 不知道如何分析数据?
**A**: 
1. 重点关注 3 个指标: Average、Throughput、Error %
2. 如果 Average < 500ms 且 Error % = 0,说明性能良好
3. 如果 Throughput > 100 req/s,说明吞吐量不错
4. 参考报告模板中的示例分析

### Q: 测试要跑多久?
**A**: 
- 50 用户 × 10 循环 ≈ 3-5 分钟
- 等测试完成后再截图
- 不要中途停止

---

## 📚 参考资料

- JMeter 使用指南: `README.md`
- 报告模板: `Performance_Test_Report_Template.md`
- 测试计划文件: `Product_API_Performance_Test.jmx`

---

**最后提醒**: 
- ⏰ 选择服务器低峰期测试
- 💾 测试完保存所有数据
- 📢 提前通知团队测试时间
- 🔒 不要在生产环境高峰期测试!

---

祝测试顺利! 🎉
有问题随时问后端同事或查看文档。
