# 📘 Feishu (飞书) 集成完整指南

> 基于 lark-cli v1.0.11 + Hermes Agent Gateway

---

## 🚀 快速开始

### 1. 安装 lark-cli
```bash
# macOS (Homebrew)
brew install yjwong/lark-cli/lark-cli

# 验证安装
lark-cli --version
# 输出：1.0.11
```

### 2. 初始化配置
```bash
lark-cli config init
# 输入 App ID 和 App Secret
```

### 3. Bot 身份认证
```bash
# 获取 tenant_access_token
lark-cli auth tenant
```

### 4. 用户身份 OAuth
```bash
# 设备码授权
lark-cli auth login --domain docs,contact,calendar,drive --recommend --no-wait

# 复制 device_code，然后执行
lark-cli auth login --device-code <code>

# 在浏览器打开 verification_url 完成授权
```

---

## 🔐 认证方式对比

| 认证方式 | 用途 | 权限范围 | 文档归属 |
|---------|------|---------|---------|
| Bot 身份 | 发送消息、企业 API | 企业级权限 | 企业所有 |
| 用户 OAuth | 个人文档、私人日历 | 个人权限 | 个人所有 |

### 关键区别
- **Bot 创建的文档** → 企业资产，用户无法获得完整管理权限
- **用户创建的文档** → 个人资产，自动拥有 full_access

---

## 📄 文档 API 使用

### 创建文档（用户身份）
```bash
# 推荐：使用用户身份，自动授予权限
lark-cli docs +create --title "我的文档" --as user

# 不推荐：Bot 身份创建，权限受限
lark-cli docs +create --title "企业文档"
```

### 更新文档
```bash
lark-cli docs +update <doc_id> --content "新内容"
```

### 删除文档
```bash
lark-cli docs +delete <doc_id>
```

### 列出文档
```bash
lark-cli docs list --folder <folder_token>
```

---

## 📊 Sheets API

### 创建表格
```bash
lark-cli sheets +create --title "数据表" --as user
```

### 读取数据
```bash
lark-cli sheets read <sheet_id> --range "A1:B10"
```

### 写入数据
```bash
lark-cli sheets write <sheet_id> --range "A1" --values "[[1,2],[3,4]]"
```

---

## 📅 日历 API

### 创建事件（需要用户 OAuth）
```bash
lark-cli calendar event create \
  --title "团队会议" \
  --start "2026-04-17T10:00:00+08:00" \
  --end "2026-04-17T11:00:00+08:00"
```

### 查询事件
```bash
lark-cli calendar event list --calendar_id primary
```

---

## 💬 消息 API

### 发送文本消息
```bash
lark-cli im message send --chat_id oc_xxx --content "Hello" --type text
```

### 发送富文本卡片
```bash
lark-cli im message send --chat_id oc_xxx --content '{"elements": [...]}' --type interactive
```

### 发送流式卡片（需要 CardKit 权限）
```bash
# 安装插件
npm install -g @larksuite/oapi-cli

# 使用 Hermes Gateway 发送
# Gateway 自动处理 typewriter 效果和 token 统计
```

---

## 🔧 常见问题

### Q1: 错误 10014 (app secret invalid)
**解决**: 检查 App Secret 是否正确（32 字符），确认域名是 `feishu` 而非 `larksuite`

### Q2: 错误 20001 (请求不合法)
**解决**: 设备码过期，重新执行 `--no-wait` 获取新码

### Q3: 错误 20043 (state 参数有误)
**解决**: 使用了国际版 Lark 域名，切换到 `feishu.cn`

### Q4: 文档无法编辑
**解决**: Bot 创建的文档企业所有，改用 `--as user` 重新创建

### Q5: WebSocket 连接失败
**解决**: 检查 Gateway 是否运行，确认 `wss://msg-frontier.feishu.cn/ws/v2` 可访问

---

## 📁 配置文件模板

### ~/.hermes/.env
```bash
FEISHU_APP_ID=cli_a957b22ca378dbb5
FEISHU_APP_SECRET=H5CbK6Ex5FIMwACHB8249fnYwpkJBqUw
FEISHU_DOMAIN=feishu
FEISHU_ALLOW_ALL_USERS=false
```

### ~/.lark-cli/config.json
```json
{
  "appId": "cli_a957b22ca378dbb5",
  "appSecret": "****",
  "brand": "feishu",
  "lang": "zh",
  "profile": "cli_a957b22ca378dbb5",
  "users": "用户 972099 (ou_2861d63b7df8900952e02c8647d29d35)"
}
```

---

## 🎯 最佳实践

1. **优先使用用户身份** — 文档、日历等个人资源用 `--as user`
2. **Bot 身份用于企业 API** — 发送消息、查询企业通讯录
3. **凭据存储 Keychain** — 不要明文出现在代码中
4. **错误重试机制** — tenant_access_token 过期自动刷新
5. **权限最小化** — 只申请必要的 OAuth scopes

---

## 📚 相关资源

- [Feishu Open Platform](https://open.feishu.cn/)
- [lark-cli GitHub](https://github.com/yjwong/lark-cli)
- [Hermes Agent Gateway](https://github.com/NousResearch/hermes-agent)
- [CardKit 文档](https://open.feishu.cn/document/cardkit)

---

*最后更新：2026-04-16*
*适用版本：lark-cli 1.0.11+*
