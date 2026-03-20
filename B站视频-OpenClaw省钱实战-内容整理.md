# 78.别再烧Token了！OpenClaw省钱实战，月费直降90%

## 视频核心内容总结

### 一、理解 Token 消耗的来源（钱到底烧在哪里）

每次调用的「底噪」可能高达 **3000-14000 个 Token**。这不是你说话的内容，而是系统注入的配置文件：

- **AGENTS.md**：代理配置、工具列表、群聊规则
- **SOUL.md**：人格设定、行为规范  
- **MEMORY.md**：长期记忆、用户偏好
- **WORKSPACE**：项目上下文、工作文件

### 二、斜杠命令快速控制上下文长度

OpenClaw 内置三条斜杠命令，直接在聊天框发送即可：

| 命令 | 作用 | 使用场景 |
|-----|-----|---------|
| `/compact` | 压缩当前会话上下文 | 聊了很久，问题前面要带一大段历史；响应变慢、价格飙升 |
| `/reset` | 保留记忆，重置当前话题 | 当前话题已结束，要聊完全不同的事情；上下文臃肿但不想清空记忆 |
| `/new` | 开启全新对话 | 彻底开启新对话，不希望任何历史上下文干扰 |

### 三、模型降级策略（日常用便宜模型，复杂任务才上贵的）

**三级 Fallback 配置（省 80-95% 成本）：**

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-6",
        "fallbacks": [
          "anthropic/claude-haiku-4-5",
          "deepseek/deepseek-chat"
        ]
      }
    }
  }
}
```

- **复杂任务**（写代码、复杂推理）：Claude Sonnet
- **中等任务**（邮件回复、简单分析）：Claude Haiku  
- **简单任务**（问候、查天气、心跳）：DeepSeek

### 四、精简系统提示词 + 限制注入量

**精简目标：**
- AGENTS.md → 压缩到 800 Token 以内
- SOUL.md → 精简到 300-500 Token
- MEMORY.md → 控制在 2000 Token 以内

**配置 bootstrapMaxChars：**
```json
{
  "agents": {
    "defaults": {
      "bootstrapMaxChars": 2000
    }
  }
}
```

### 五、上下文裁剪 contextPruning（官方配置）

自动丢弃过期工具输出，保留关键信息：

```json
{
  "contextPruning": {
    "enabled": true,
    "maxToolResultLength": 2000
  }
}
```

或者使用 TTL 模式：
```json
{
  "contextPruning": {
    "mode": "cache-ttl",
    "ttl": "5m"
  }
}
```

### 六、心跳优化：lightContext + 专用模型 + 降频

```json
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "every": "45m",
        "model": "deepseek/deepseek-chat",
        "lightContext": true
      }
    }
  }
}
```

### 七、图片 Token 优化 imageMaxDimensionPx

限制图片尺寸以减少 Token 消耗：
```json
{
  "agents": {
    "defaults": {
      "imageMaxDimensionPx": 1024
    }
  }
}
```

### 八、压缩模型降级 compaction.model

配置压缩时使用的模型（用便宜模型做压缩）：
```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "model": "deepseek/deepseek-chat",
        "reserveTokensFloor": 40000,
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 4000
        }
      }
    }
  }
}
```

### 九、会话自动重置 session.reset

定期清理会话，控制上下文膨胀：
```json
{
  "agents": {
    "defaults": {
      "session": {
        "reset": {
          "enabled": true,
          "afterMessages": 50,
          "afterMinutes": 60
        }
      }
    }
  }
}
```

### 十、多 Agent 分流 + 子 Agent 模型降级

**架构层面优化：**
- 为不同团队/职能配置独立 Agent
- 每个 Agent 有自己的 workspace、记忆、技能、模型
- 主 Agent 用强模型，子 Agent 用轻量模型

```json
{
  "agents": {
    "defaults": {
      "subagent": {
        "model": "deepseek/deepseek-chat"
      }
    }
  }
}
```

### 十一、记忆搜索优化

**内置 memory-search：**
- 让 Agent 主动查找历史记忆
- 不要靠把所有历史对话塞进上下文

**QMD 后端（高级）：**
```json
{
  "memory": {
    "backend": "qmd",
    "qmd": {
      "searchMode": "search",
      "includeDefaultMemory": true,
      "sessions": {
        "enabled": true
      }
    }
  }
}
```

### 十二、其他省钱技巧

**设置日预算上限（防爆炸）：**
```json
{
  "agents": {
    "defaults": {
      "budget": {
        "maxTokensPerDay": 500000,
        "maxCostPerDay": 5.00
      }
    }
  }
}
```

**本地模型兜底（零成本）：**
```bash
ollama pull qwen3-coder:32b
# 配置 OLLAMA_API_KEY 即可使用
```

## 综合效果

按上述配置实施后，Token 消耗可降低 **60-90%**：

| 优化项 | 预估节省 |
|-------|---------|
| 模型分级策略 | 60-80% |
| 上下文瘦身 | 30-90% |
| Cron/Heartbeat 优化 | 5-10% |
| contextPruning | 10-20% |

---

*内容来源：B站视频《78.别再烧Token了！OpenClaw省钱实战，月费直降90%》*
*整理时间：2026-03-20*
