# 🤖 Hermes Agent 工作空间

## 📁 目录结构

```
hermes-agent-workspace/
├── README.md          # 本文件
├── docs/              # 文档和知识库
├── skills/            # 自定义技能
├── configs/           # 配置文件
├── logs/              # 运行日志
└── plans/             # 任务计划
```

---

## 🎯 用途

此文件夹用于存放与 Hermes Agent 相关的所有工作内容、知识库和配置。

### 主要功能

1. **文档沉淀** — 记录 Hermes Agent 的使用经验、最佳实践
2. **技能开发** — 创建和维护自定义技能
3. **配置管理** — 存储 Feishu、GitHub 等集成配置
4. **日志归档** — 保存重要会话和任务日志
5. **任务规划** — 多会话任务的计划和进度跟踪

---

## 🔧 已配置集成

### Feishu (飞书)
- **App ID**: `cli_a957b22ca378dbb5`
- **认证方式**: Bot 身份 + 用户 OAuth
- **用户 ID**: `ou_2861d63b7df8900952e02c8647d29d35`
- **功能**: IM 消息、文档 API、流式卡片、日历、联系人

### GitHub
- **仓库**: `kongpanxing548-lang/Sing-`
- **用途**: 音频研究 + 音游测试 + 音频创作
- **Token**: 已配置（Keychain 存储）

---

## 📚 核心技能

| 技能名称 | 用途 |
|---------|------|
| `hermes-architecture-patterns` | Hermes 核心架构模式（8 个模式） |
| `feishu-docs` | Feishu 文档 API 封装 |
| `feishu-streaming-card` | Feishu 流式卡片插件 |
| `systematic-debugging` | 系统化调试方法 |
| `subagent-driven-development` | 子代理驱动开发 |
| `writing-plans` | 任务规划规范 |

---

## 📋 使用规范

### 文档存储
- **docs/** — 技术文档、API 参考、使用指南
- **plans/** — 任务计划（Markdown 格式）
- **configs/** — 配置文件模板（不含敏感信息）
- **skills/** — 自定义技能（SKILL.md 格式）
- **logs/** — 重要会话日志和任务输出

### Git 提交规范
```bash
git add .
git commit -m "feat: 添加 Feishu 文档技能"
git commit -m "docs: 更新 Hermes 架构文档"
git commit -m "fix: 修复 OAuth 认证流程"
```

---

## 🚀 快速开始

### 1. 克隆仓库
```bash
git clone https://github.com/kongpanxing548-lang/Sing-.git
cd Sing-/hermes-agent-workspace
```

### 2. 查看可用技能
```bash
hermes skills list
```

### 3. 加载技能
```bash
hermes skill view feishu-docs
```

---

## 📊 当前状态

- ✅ Feishu Bot 身份认证完成
- ✅ Feishu 用户 OAuth 完成
- ✅ 6 个核心技能创建/更新
- ✅ 天气预警 Cron 任务部署（每日 9:00）
- ✅ 工作空间目录结构建立

---

*最后更新：2026-04-16*
*Hermes Agent 版本：qwen3.5:397b*
