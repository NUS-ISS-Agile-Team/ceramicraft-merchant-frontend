# Product API Performance Test – Quick Conclusion

来源：JMeter 5.6.3 Summary Report（截图）

## Test setup
- Target: http://47.129.72.211
- APIs:
  - GET /product-ms/v1/customer/list
  - GET /product-ms/v1/customer/product/{id}
- Thread Group: 50 users, ramp-up 10s, loop 10（2 个接口各 500 次，合计 1000 次）
- HTTP: Keep-Alive, 无思考时间（think time）
- Errors: 0.00%

## Key metrics
- Max concurrency（最大并发）: 50 虚拟用户（ramp-up 后达到稳定并发 50）
- Highest QPS（最高 QPS/吞吐）:
  - TOTAL Throughput ≈ 101.1 requests/sec（两接口合计）
  - 单接口吞吐 ≈ 50.6 requests/sec（各 500 样本）
- Avg latency（平均延迟）: 10 ms（Summary Report 的 Average 列）
- Min/Max: 5 ms / 105 ms

> 说明：JMeter Summary Report 的 Throughput 为整个测试周期的平均吞吐；Graph Results 中也显示约 6,083 req/min ≈ 101 req/s，与 Summary 一致。若需要严格意义上的“峰值 QPS”，建议开启“Throughput Shaping Timer + PerfMon/Timeseries 监听器”或记录 TPS Over Time 曲线后取峰值。

## Interpretation
- 在 50 并发下，系统能稳定提供 ~101 req/s 的吞吐，平均延迟仅 ~10ms，且 0% 错误，表现非常稳定。

## Next steps（如需寻找系统极限）
1. 梯度加压：并发依次提升为 50 → 100 → 200 → 400，保持相同脚本与无思考时间；每级运行 3-5 分钟稳定段。
2. 每级记录：TOTAL Throughput、Average/P95 延迟、Error %。当 Error% 上升或 P95>200ms（或团队阈值）即为容量上限附近。
3. 同步观察 Grafana（CPU/内存/QPS/响应时间/错误率/网络 IO），截取稳定区间图表。
4. 将各级数据与图表补充进 `performance-test/Performance_Test_Report_Template.md`。
