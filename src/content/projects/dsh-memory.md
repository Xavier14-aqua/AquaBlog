---
title: "QQ 对话 Agent 长期记忆系统（DSH Memory）"
summary: "为 QQbridge 与 DeepSeek Harness 设计的长期记忆插件，解决群聊 bot 失忆、人设漂移、消息遗漏和 Prompt 成本膨胀问题。"
kind: "project"
status: "active"
stack: ["Node.js", "DeepSeek API", "MCP", "JSON Schema", "Agent Memory"]
highlights:
  - "读写分离 + 独立 Worker + Pending 队列 + Seq Generation 原子写，避免记忆整理阻塞实时问答，异常网络消息遗漏降至零。"
  - "4 级自适应批处理 + 会话退役（100k Token / 12 Steps），有效控制 Attention 稀释与 API 成本。"
  - "JSON Schema 补丁隔离模型输出，支持事务恢复与按批次回滚；Top-K + 字符二元组去重 + 身份隔离 + 动态字符预算。"
repoUrl: "https://github.com/Xavier14-aqua/DSH_memory"
pubDate: 2026-11-20
---

项目已开源至 GitHub，README 包含完整架构说明与部署配置，后续将在此补充核心设计复盘。