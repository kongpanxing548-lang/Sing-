# 🏗️ Hermes Agent 核心架构模式

> 基于 NousResearch/hermes-agent (89.4k stars) 的深度分析与内化

---

## 📋 模式概览

| 模式 | 用途 | 复杂度 |
|------|------|--------|
| 1. 自注册工具注册表 | 工具自动发现与注册 | ⭐⭐⭐ |
| 2. 隔离子代理委托 | 并行任务执行 | ⭐⭐⭐⭐ |
| 3. 技能作为程序记忆 | 可复用工作流存储 | ⭐⭐ |
| 4. 跨会话搜索 | 长期记忆检索 | ⭐⭐ |
| 5. 多平台网关 | 统一消息接口 | ⭐⭐⭐⭐ |
| 6. 上下文压缩 | Token 优化 | ⭐⭐⭐ |
| 7. 凭证池化 | 安全凭据管理 | ⭐⭐⭐ |
| 8. 工具集分组 | 安全边界控制 | ⭐⭐ |

---

## 1️⃣ 自注册工具注册表 (Self-Registering Tool Registry)

### 核心思想
工具通过装饰器自动注册，无需手动维护列表。

### 实现模式
```python
# tools/delegate_tool.py
@register_tool
def delegate_task(goal: str, context: str = None, toolsets: list = None):
    """Spawn subagents for parallel work"""
    ...
```

### 优势
- ✅ 新增工具自动可用
- ✅ 减少维护成本
- ✅ 支持 AST 静态分析

### 应用示例
```bash
# 工具自动发现
hermes tools list
# 输出包含所有 @register_tool 装饰的函数
```

---

## 2️⃣ 隔离子代理委托 (Isolated Subagent Delegation)

### 核心思想
每个子代理拥有独立的上下文、终端会话和工具集。

### 关键约束
- ❌ 子代理不能递归委托（禁止 `delegate_task`）
- ❌ 子代理不能写入记忆（禁止 `memory`）
- ❌ 子代理不能与用户交互（禁止 `clarify`）
- ✅ 最多 3 个并发子代理
- ✅ 工作区路径注入（`cwd` 隔离）

### 使用场景
```python
# 并行研究任务
delegate_task(tasks=[
    {"goal": "研究 A 方案", "toolsets": ["web", "terminal"]},
    {"goal": "研究 B 方案", "toolsets": ["web", "file"]},
    {"goal": "研究 C 方案", "toolsets": ["browser"]},
])
```

### 上下文隔离
```python
context = "文件路径：/path/to/file.py\n错误信息：ModuleNotFoundError"
# 子代理只收到显式传递的上下文，不继承父代理对话历史
```

---

## 3️⃣ 技能作为程序记忆 (Skills as Procedural Memory)

### 核心思想
技能 = 可执行的工作流文档，包含精确命令、陷阱和验证步骤。

### 技能结构
```markdown
---
name: feishu-docs
category: productivity
triggers: ["feishu doc", "create lark document", "飞书文档"]
---

## 步骤
1. 认证：`lark-cli auth login`
2. 创建：`lark-cli docs +create --title "xxx"`
3. 权限：使用 `--as user` 自动授予用户权限

## 陷阱
- Bot 创建的文档企业所有，用户无法编辑
- 必须使用 OAuth 用户身份创建个人文档

## 验证
- 检查文档 URL 是否可访问
- 确认用户有编辑权限
```

### 保存时机
- ✅ 复杂任务成功（5+ 工具调用）
- ✅ 解决棘手错误后
- ✅ 发现非平凡工作流
- ✅ 用户纠正方法后

### 加载策略
```bash
# 即使知道任务也要加载技能（包含用户偏好）
hermes skill view feishu-docs
```

---

## 4️⃣ 跨会话搜索 (Cross-Session Search)

### 核心思想
使用 FTS5 全文搜索检索历史会话，避免用户重复说明。

### 搜索语法
```bash
# 关键词 OR 连接（宽召回）
session_search query="feishu OR lark OR 飞书"

# 短语精确匹配
session_search query="OAuth device code"

# 布尔表达式
session_search query="skill NOT memory"
```

### 使用场景
- 用户说"我们之前做过这个"
- 用户引用过去的项目/人/概念
- 需要检查是否解决过类似问题

### 实现细节
```python
# FTS5 索引所有会话消息
# 返回 LLM 生成的会话摘要
```

---

## 5️⃣ 多平台网关 (Multi-Platform Gateway)

### 核心思想
统一抽象层支持 Telegram、Discord、Feishu、WhatsApp 等平台。

### 架构
```
gateway/
├── platforms/
│   ├── feishu.py      # WebSocket 连接
│   ├── telegram.py    # Long Polling
│   └── discord.py     # WebSocket
├── config.py          # 统一配置加载
└── message_router.py  # 消息路由
```

### Feishu 实现
```python
# WebSocket 连接
wss://msg-frontier.feishu.cn/ws/v2?fpid=493&aid=552564

# 认证流程
1. 获取 tenant_access_token (Bot)
2. OAuth device flow (用户)
3. WebSocket 握手
```

---

## 6️⃣ 上下文压缩 (Context Compression)

### 核心思想
动态压缩历史消息，保留关键信息，减少 Token 消耗。

### 压缩策略
- 工具输出 → 摘要（保留关键数据）
- 长对话 → 轮次合并
- 代码块 → 保留签名，省略实现

### 实现
```python
# 超过 8000 字符自动 LLM 摘要
if len(context) > 8000:
    context = llm_summarize(context)
```

---

## 7️⃣ 凭证池化 (Credential Pooling)

### 核心思想
凭据集中存储（Keychain/环境变量），按需注入会话。

### 存储位置
```bash
# macOS Keychain
security find-generic-password -s "lark-cli" -w

# 环境变量
~/.hermes/.env:
  FEISHU_APP_ID=cli_xxx
  FEISHU_APP_SECRET=***
```

### 安全规则
- ❌ 凭据不进入对话历史
- ❌ 凭据不写入日志
- ✅ 工具内部透明使用

---

## 8️⃣ 工具集分组 (Toolset Grouping)

### 核心思想
按安全边界分组工具，子代理仅获得必要工具集。

### 工具集定义
```python
toolsets = {
    "web": ["web_search", "browser_*"],
    "file": ["read_file", "write_file", "patch", "search_files"],
    "terminal": ["terminal", "process"],
    "skills": ["skill_view", "skills_list", "skill_manage"],
}
```

### 安全边界
```python
# 子代理仅获得必要工具
delegate_task(
    goal="研究 X 方案",
    toolsets=["web", "file"]  # 无 terminal，无 memory
)
```

---

## 🎯 应用检查清单

创建新技能/工具时检查：

- [ ] 是否符合自注册模式？
- [ ] 是否需要子代理隔离？
- [ ] 是否应该保存为技能？
- [ ] 是否需要跨会话搜索支持？
- [ ] 是否通过网关抽象？
- [ ] 是否需要上下文压缩？
- [ ] 凭据是否安全存储？
- [ ] 工具集是否合理分组？

---

*文档版本：1.0*
*最后更新：2026-04-16*
*基于 Hermes Agent v1.6.0 分析*
