# OpenClaw 已安装技能清单

**最后更新：** 2026-03-20  
**总计：** 62 个技能

## 分类统计

| 分类 | 数量 |
|------|------|
| 🦅 飞书 Lark 核心技能 | 9 |
| 🧠 系统/开发类 | 13 |
| 📝 笔记/知识库类 | 8 |
| 🎵 媒体/音频/语音 | 9 |
| 🌐 第三方服务集成 | 11 |
| 🏠 生活/位置服务 | 10 |
| **总计** | **62** |

---

## 一、🦅 飞书 Lark 核心技能

| 技能名称 | 功能作用 |
|----------|----------|
| `feishu-bitable` | 飞书多维表格（Bitable）创建、查询、编辑和管理，支持 27 种字段类型、高级筛选、批量操作、视图管理 |
| `feishu-calendar` | 飞书日历与日程管理，支持创建会议、查询日程、参会人管理、忙闲查询 |
| `feishu-channel-rules` | Lark/Feishu 频道输出格式规则 |
| `feishu-create-doc` | 从 Lark-flavored Markdown 创建飞书云文档 |
| `feishu-fetch-doc` | 获取飞书云文档内容，转换为 Markdown 格式 |
| `feishu-im-read` | 飞书 IM 消息读取，支持历史消息、话题回复、跨会话搜索、图片/文件下载 |
| `feishu-task` | 飞书任务管理，创建/查询/更新任务和任务清单 |
| `feishu-troubleshoot` | 飞书插件问题排查，常见问题 FAQ 和深度诊断 |
| `feishu-update-doc` | 更新飞书云文档，支持追加/覆盖/替换/删除等7种模式 |

---

## 二、🧠 系统/开发类

| 技能名称 | 功能作用 |
|----------|----------|
| `self-improving-agent` | **自我改进代理** ✨ 自我反思、自我批判、自我学习、内存管理持续优化（需重启加载） |
| `memory-manager` | 长期内存管理，LanceDB 优先存储策略 |
| `coding-agent` | 代码编写代理，协助开发和调试 |
| `github` | GitHub 交互，支持 issue、PR、CI、API 操作 |
| `skill-creator` | 技能创建工具，帮助创建新的 OpenClaw 技能 |
| `skill-vetter` | 技能审核验证工具 |
| `web-content-fetcher` | 网页内容获取提取 |
| `lobster` | 通用工具库 |
| `model-usage` | 模型使用统计和监控 |
| `prose` | Open Prose 写作助手 |
| `session-logs` | 会话日志管理 |
| `tmux` | tmux 终端管理 |
| `bluebubbles` | BlueBubbles iMessage 通道插件开发 |

---

## 三、📝 笔记/知识库类

| 技能名称 | 功能作用 |
|----------|----------|
| `1password` | 1Password 密码管理集成 |
| `apple-notes` | Apple 备忘录访问 |
| `apple-reminders` | Apple 提醒事项集成 |
| `bear-notes` | Bear 笔记访问 |
| `notion` | Notion API 集成，创建管理页面和数据库 |
| `obsidian` | Obsidian 笔记库访问 |
| `bird` | Bird 发推工具 |
| `blogwatcher` | 博客更新监控 |

---

## 四、🎵 媒体/音频/语音

| 技能名称 | 功能作用 |
|----------|----------|
| `sag` | ElevenLabs TTS 文本转语音 |
| `sherpa-onnx-tts` | Sherpa-ONNX 本地 TTS 语音合成 |
| `openai-whisper` | OpenAI Whisper 本地语音转文字 |
| `openai-whisper-api` | OpenAI Whisper API 语音转文字 |
| `spotify-player` | Spotify 播放器控制 |
| `sonoscli` | Sonos 音箱控制 |
| `songsee` | 歌词搜索 |
| `himalaya` | 喜马拉雅访问 |
| `video-frames` | 视频帧提取 |

---

## 五、🌐 第三方服务集成

| 技能名称 | 功能作用 |
|----------|----------|
| `discord` | Discord 频道控制 |
| `slack` | Slack 消息控制，支持反应、固定消息 |
| `trello` | Trello 项目管理集成 |
| `gemini` | Google Gemini 模型调用 |
| `openai-image-gen` | OpenAI DALL·E 图像生成 |
| `nano-pdf` | PDF 处理工具 |
| `openhue` | Philips Hue 智能灯控制 |
| `oracle` | Oracle 数据库集成 |
| `blucli` | Blurple CLI 工具 |
| `gog` | GOG 游戏平台集成 |
| `clawdhub` | ClawHub 技能市场访问 |

---

## 六、🏠 生活/位置服务

| 技能名称 | 功能作用 |
|----------|----------|
| `food-order` | 点餐助手 |
| `ordercli` | 命令行订单管理 |
| `local-places` | 本地地点搜索 |
| `goplaces` | 出行规划助手 |
| `weather` | 天气预报查询 |
| `things-mac` | Things.app 任务管理（Mac）|
| `voice-call` | 语音呼叫 |
| `wacli` | WebAssembly CLI 工具 |
| `imsg` | iMessage 集成 |
| `peekaboo` | 隐私保护工具 |

---

## 项目信息

- 早盘报告自动生成脚本：`scripts/morning_report_improved.py`
- 支持自动获取全球股指、A50、人民币汇率、财经新闻、龙虎榜、放量突破扫描
- 具备 fallback 备用数据机制，API 获取失败时仍能生成报告
- 每日定时推送：开盘前 8:40-9:00 推送至飞书群 oc_35247479849377a6e2d657d623193a57

---

*文档生成时间：2026-03-20 11:30:00*
