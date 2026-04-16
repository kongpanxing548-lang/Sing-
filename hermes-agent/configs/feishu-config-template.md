# Feishu 配置模板

> ⚠️ 敏感信息请使用 Keychain 存储，不要提交到 Git

---

## 环境变量 (~/.hermes/.env)

```bash
# Feishu App 配置
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx  # 建议用 Keychain

# 域名配置
FEISHU_DOMAIN=feishu          # 中国大陆版
# FEISHU_DOMAIN=larksuite     # 国际版（不适用）

# 用户策略
FEISHU_ALLOW_ALL_USERS=false  # true=允许所有用户，false=仅白名单

# 连接模式
FEISHU_MODE=websocket         # websocket 或 polling
```

---

## lark-cli 配置 (~/.lark-cli/config.json)

```json
{
  "appId": "cli_xxx",
  "appSecret": "****",
  "brand": "feishu",
  "lang": "zh",
  "profile": "cli_xxx",
  "users": "用户名称 (ou_xxx)"
}
```

---

## OAuth Scopes 申请

### 基础权限
- `im:message` — 发送消息
- `im:message:send_as_bot` — 以 Bot 身份发送

### 文档权限
- `docx:document:create` — 创建文档
- `docx:document:write_only` — 写入文档
- `docx:document:readonly` — 读取文档
- `docs:document.media:download/upload` — 媒体文件

### 日历权限
- `calendar:calendars:readonly` — 读取日历
- `calendar:events:rw` — 读写事件

### CardKit 权限
- `cardkit:card` — 渲染卡片
- `im:message:interactive` — 交互消息

---

## 获取 App Secret

1. 登录 [Feishu 开放平台](https://open.feishu.cn/)
2. 选择应用 → 凭证管理
3. 复制 App Secret（32 字符）
4. 存储到 Keychain:
   ```bash
   security add-generic-password -s "lark-cli" -a "app_secret" -w "YOUR_SECRET"
   ```

---

## 验证配置

```bash
# 检查配置
lark-cli config show

# 测试 Bot 认证
lark-cli auth tenant

# 测试用户认证
lark-cli auth login --recommend

# 测试消息发送
lark-cli im message send --chat_id oc_xxx --content "Test" --type text
```

---

*模板版本：1.0*
*最后更新：2026-04-16*
