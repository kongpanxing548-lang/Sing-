# Sing Walking

个人音乐展示网站原型。这个项目不是播放器或作品网盘，而是「音乐人格 + 内容宇宙」的数字载体。

## Source

- 飞书需求文档：`https://ocnils9e6o5e.feishu.cn/wiki/TbDwwUGUsilyfoklafYcZ4bknRg`
- 官方 CLI 导出的 Markdown：`docs/feishu-official.md`

## First Prototype

直接打开 `index.html` 即可预览。

当前版本包含：

- 沉浸式首屏：行走 / 城市夜路 / 自我反思
- 精选音乐：5 首作品卡片和播放状态
- Journey：围绕《行走》的滚动叙事
- Journal：创作日志入口
- About：故事式人物时间线
- Build：从原型到内容宇宙的阶段路线

## Phase 2 Player

当前播放器已经是可替换真实音频的结构：

- 每首歌的数据在 `data/site-content.js`
- 将音频文件放到 `assets/audio/`
- 在对应歌曲里填写 `audio: "assets/audio/your-song.mp3"`
- 如果 `audio` 为空，页面会使用浏览器 Web Audio 生成很轻的试听氛围声，并保持播放状态、进度条和切歌体验

每张音乐卡片现在有两个入口：

- 播放：更新底部常驻播放器
- 查看故事：打开单曲详情弹层，展示创作故事、歌词片段、制作信息

## Journey Scroll Sync

Journey 区域已经支持滚动驱动：

- 每个叙事段落绑定一首歌：`journeyBeats[].songId`
- 滚动到段落附近时，当前章节、进度点、播放器曲目和页面氛围色会同步更新
- 默认不会自动播放声音，避免打扰用户
- 如果用户已经在播放，继续滚动会跟随叙事切换声音
- 点击 Journey 段落里的播放按钮，会把该段设为当前章节并开始播放

## Five Layers

1. 品牌表达：行走、过程、内心、城市、真实表达。
2. 内容结构：首页、音乐、Journey、日志、关于、联系。
3. 产品功能：常驻播放器、作品卡片、创作故事、制作信息、日志系统。
4. 技术架构：当前静态原型，后续可升级 Next.js + CMS + Wavesurfer.js。
5. 开发执行：先验证气质和叙事，再补真实音频、CMS、SEO 和上线流程。

## Multi-Agent Notes

- 主线程：拉取飞书文档、搭建页面骨架、集成视觉和交互。
- 内容代理：提炼品牌定位、首页结构、Journey beats、日志角度。
- 技术代理：确认第一版采用静态原型，真实音频和 CMS 后置。
- 内容数据代理：产出 `data/site-content.js`，由主线程修正编码并接入。

## Files

- `index.html`：页面结构
- `styles.css`：视觉系统与响应式布局
- `script.js`：内容渲染、播放器状态、滚动 reveal
- `data/site-content.js`：站点内容数据
- `assets/sing-walking-hero.png`：首屏视觉资产
