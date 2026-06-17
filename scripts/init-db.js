const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const catalogPath = path.join(rootDir, "assets", "sleep-catalog.json");
const dbDir = path.join(rootDir, "data");
const dbPath = path.join(dbDir, "astrasonic.sqlite");

function sql(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function json(value) {
  return sql(JSON.stringify(value ?? null));
}

function insert(table, values) {
  const columns = Object.keys(values);
  return `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map((column) => values[column]).join(", ")});`;
}

const agreementSeeds = [
  {
    type: "ai_disclosure",
    title: "AI 生成/辅助生成披露规则",
    content: `AI 生成/辅助生成披露规则 · v2026.05

一、适用范围

本规则适用于平台内所有由创作者上传、发布、展示、授权、销售或参与收益分成的音乐、音效、语音、采样、Loop、Stem、工程文件及其他音频相关作品。

凡作品在创作过程中使用了 AI 生成、AI 辅助生成、AI 改编、AI 分离、AI 修复、AI 混音、AI 母带、AI 配音、AI 歌声合成、AI 音效生成等技术，创作者均应按照本规则进行真实、完整披露。

二、AI 使用类型定义

平台将 AI 使用情况分为以下几类：

1. 完全人工创作

作品的旋律、和声、编曲、录音、音效设计、混音、母带等核心内容均由创作者或其合法授权团队完成，未使用 AI 生成核心内容。

2. AI 辅助创作

作品主要创意由创作者完成，但在部分环节使用 AI 工具辅助，例如：

* AI 辅助生成灵感草稿；
* AI 辅助编曲参考；
* AI 辅助混音或母带；
* AI 辅助降噪、修复、分轨；
* AI 辅助生成部分声音素材；
* AI 辅助歌词、标题、描述或标签生成。

3. AI 参与核心生成

作品中的主要旋律、主要音色、主要音效、主要人声、主要段落或整体结构由 AI 工具生成，创作者进行了筛选、编辑、改编、混音或二次创作。

4. AI 完整生成

作品大部分或全部内容由 AI 工具生成，创作者主要进行提示词输入、筛选、整理、发布或轻度后期处理。

三、创作者披露义务

创作者上传作品时，应如实选择 AI 使用情况，并补充以下信息：

* 是否使用 AI 工具；
* 使用的 AI 工具名称；
* AI 参与的创作环节；
* AI 生成内容占作品整体的大致比例；
* 是否使用第三方作品作为 AI 输入、参考、训练、采样或风格模仿来源；
* 是否存在仿冒特定艺术家、歌手、配音演员、影视角色或游戏 IP 声音风格的情况。

创作者不得故意隐瞒、虚假填写或误导平台及用户。

四、禁止行为

平台禁止上传以下 AI 相关内容：

1. 未经授权使用他人音乐、音效、声音、采样、录音或作品作为 AI 输入素材生成的内容；
2. 明显模仿特定在世歌手、配音演员、音乐人、作曲家或音频品牌风格并可能造成混淆的内容；
3. 未经授权使用真实人物声音进行 AI 克隆、合成、配音或演唱的内容；
4. 使用 AI 生成侵权、违法、虚假、恶意、欺诈、色情、暴力、仇恨或其他违规内容；
5. 将 AI 生成内容虚假标注为完全人工原创；
6. 通过 AI 批量生成低质量、重复性、垃圾内容占用平台资源。

五、平台标识规则

平台有权根据创作者披露信息及平台审核结果，对作品添加以下标识：

* 人工原创；
* AI 辅助创作；
* AI 参与生成；
* AI 生成内容；
* AI 信息待补充；
* AI 合规风险待审核。

平台可在作品详情页、授权页面、下载页面、交易页面或版权说明中向用户展示相关标识。

六、责任承担

创作者应对其 AI 使用行为、上传内容及披露信息的真实性、合法性和完整性负责。

如因创作者未披露、虚假披露或违规使用 AI 工具导致侵权、投诉、索赔、行政处罚、平台损失或用户损失，创作者应独立承担全部责任，并赔偿平台及相关第三方因此遭受的损失。

七、平台处理措施

如平台发现作品存在 AI 披露异常、侵权风险或违规情况，平台有权采取以下措施：

* 要求创作者补充说明；
* 暂停作品展示；
* 暂停下载、授权或交易；
* 下架相关作品；
* 冻结或延迟结算收益；
* 限制账号功能；
* 终止创作者合作；
* 配合权利人或监管部门处理相关纠纷。`
  },
  {
    type: "copyright_split",
    title: "版权授权与分成协议",
    content: `版权授权与分成协议 · v2026.05

一、协议目的

本协议用于明确创作者将作品上传至平台后，平台、创作者及用户之间关于作品展示、试听、推广、授权、转授权、销售、收益分成及版权责任的基本规则。

二、作品权利声明

创作者确认，其上传至平台的作品应符合以下条件：

1. 创作者拥有完整、合法、可授权的著作权或相关权利；
2. 作品不存在侵犯第三方著作权、邻接权、表演者权、录音制作者权、肖像权、姓名权、声音权益、商标权、商业秘密或其他合法权益的情形；
3. 如作品中包含第三方采样、Loop、人声、素材、插件预设、采样包或其他授权内容，创作者已获得合法授权；
4. 创作者有权将作品上传至平台并授权平台进行展示、推广、销售、授权或转授权。

三、授权范围

创作者同意授予平台一项非独占、全球范围内、可转授权、可展示、可推广、可商业化分发的授权，用于以下用途：

* 在平台内展示作品；
* 提供在线试听、预览、收藏、搜索、推荐；
* 进行作品推广、榜单展示、专题策划；
* 向用户提供下载、授权、购买或订阅使用；
* 根据平台业务需要进行格式转换、音量标准化、转码、水印处理、预览片段生成；
* 在平台官方渠道进行宣传展示；
* 为实现用户购买、授权、结算、客服、维权等目的进行必要使用。

四、授权类型

平台可根据产品设计提供以下授权模式：

1. 个人使用授权

用户可将作品用于个人非商业用途，例如个人视频、练习作品、个人展示等。

2. 商业使用授权

用户可将作品用于商业项目，包括但不限于广告、短视频、游戏、影视、动画、播客、直播、品牌宣传、应用软件、线下活动等。

3. 买断授权

用户在特定条件下获得作品的独占或排他使用权。是否支持买断、买断范围、期限、地域、媒介及价格应以具体订单或补充协议为准。

4. 定制授权

用户可根据项目需求与创作者或平台协商定制音乐、音效、配音或其他音频内容。

五、收益分成

平台根据作品实际销售、授权、订阅、推广或其他商业化收入，与创作者进行收益分成。

默认分成方式可设定为：

* 创作者分成：70%
* 平台服务费：30%

具体分成比例可根据创作者等级、作品类型、平台活动、独家合作、定制项目或补充协议另行约定。

六、结算规则

平台按照实际收到的用户付款金额，在扣除退款、税费、支付通道费、推广成本、平台服务费及其他应扣费用后，向创作者结算可分配收益。

结算周期、最低提现金额、税务处理、发票要求、银行账户或支付账户信息，由平台规则另行说明。

七、退款与撤销

如用户因作品质量、授权错误、侵权投诉、重复购买、技术问题或其他合理原因申请退款，平台有权根据实际情况处理。

如相关订单已计入创作者收益，平台有权在后续结算中扣回对应金额。

八、侵权责任

如作品被第三方投诉侵权，平台有权暂停作品展示、冻结相关收益、要求创作者提供权属证明。

如最终确认作品侵权，创作者应承担全部法律责任，并赔偿平台、用户及第三方因此遭受的全部损失。

九、作品下架

创作者可申请下架作品，但已完成授权、购买或下载的用户，其已获得的合法使用权不受影响。

如作品因侵权、违规、投诉、政策变化或平台运营原因被下架，平台有权停止继续展示和授权。

十、协议终止

创作者终止与平台合作后，平台应停止对其作品进行新的商业授权，但此前已经完成的用户授权继续有效。`
  },
  {
    type: "creator",
    title: "创作者入驻协议",
    content: `创作者入驻协议 · v2026.05

一、入驻资格

申请入驻平台的创作者应具备合法身份、真实联系方式及完整的作品权利能力。

创作者可以是：

* 个人音乐人；
* 作曲家；
* 音效设计师；
* 配音演员；
* 声音设计团队；
* 音频工作室；
* 唱片公司；
* 版权代理机构；
* 其他合法音频内容提供方。

二、身份认证

创作者入驻时，应根据平台要求提交以下信息：

* 真实姓名或主体名称；
* 联系方式；
* 身份证明或企业资质；
* 收款账户；
* 作品样例；
* 版权归属说明；
* 其他平台要求的信息。

平台有权对创作者身份、资质和作品质量进行审核。

三、账号责任

创作者应妥善保管账号、密码及登录凭证。

通过创作者账号完成的上传、编辑、授权、提现、协议确认等行为，均视为创作者本人或其授权人员操作。

因账号管理不当导致的损失，由创作者自行承担。

四、作品上传要求

创作者上传作品时，应保证：

1. 作品内容合法；
2. 作品权属清晰；
3. 文件质量符合平台要求；
4. 作品信息、标签、标题、描述真实准确；
5. 未侵犯任何第三方权益；
6. 已如实披露 AI 使用情况；
7. 未重复上传低质量、相似度过高或误导性内容。

五、创作者行为规范

创作者不得从事以下行为：

* 上传侵权作品；
* 盗用他人身份或作品；
* 虚假标注原创、独家或授权范围；
* 恶意刷量、刷下载、刷评价；
* 绕开平台私下交易；
* 发布违法、低俗、歧视、暴力、仇恨或恶意内容；
* 干扰平台正常运营；
* 损害平台、用户或其他创作者权益。

六、收益与提现

创作者通过平台获得的作品授权收入、销售收入、订阅分成、定制收入或其他收益，应按照平台结算规则进行提现。

创作者应自行承担与其收益相关的税费、申报和合规责任，平台可根据法律法规要求进行代扣代缴或要求创作者提供必要票据。

七、平台审核权

平台有权对创作者上传的作品、资料、授权信息及账号行为进行审核。

审核不代表平台对作品权属、质量、合法性作出绝对保证，创作者仍应对其作品承担最终责任。

八、违规处理

创作者违反本协议或平台规则的，平台有权采取以下措施：

* 警告；
* 要求整改；
* 限制上传；
* 暂停作品展示；
* 下架作品；
* 冻结收益；
* 暂停提现；
* 限制账号功能；
* 终止入驻资格；
* 追究法律责任。`
  },
  {
    type: "privacy",
    title: "隐私政策",
    content: `隐私政策 · v2026.05

一、适用范围

本隐私政策适用于用户、创作者及访问者在使用平台网站、小程序、移动端应用、后台管理系统及相关服务时，平台对个人信息的收集、使用、存储、共享和保护规则。

二、信息收集范围

平台可能收集以下信息：

1. 账号信息

包括手机号、邮箱、用户名、头像、密码、登录方式、账号状态等。

2. 身份认证信息

包括姓名、身份证明、企业资质、营业执照、联系人信息、收款账户、税务信息等。

3. 作品信息

包括上传的音乐、音效、语音、图片、封面、标题、描述、标签、版权声明、AI 使用披露信息等。

4. 交易信息

包括订单信息、购买记录、授权记录、下载记录、付款状态、发票信息、退款记录等。

5. 设备与日志信息

包括 IP 地址、设备型号、浏览器类型、操作系统、访问时间、点击行为、搜索记录、错误日志等。

6. 客服与沟通信息

包括咨询记录、投诉记录、反馈内容、工单信息、邮件往来等。

三、信息使用目的

平台收集和使用个人信息的目的包括：

* 创建和管理账号；
* 完成身份认证；
* 提供作品上传、展示、搜索、试听、下载、授权服务；
* 完成订单、支付、结算和发票处理；
* 进行版权审核、侵权处理和争议解决；
* 提供客服支持；
* 优化平台体验；
* 防范欺诈、侵权、违规和安全风险；
* 履行法律法规要求。

四、信息共享

平台不会未经授权向第三方出售用户个人信息。

在以下情况下，平台可能共享必要信息：

* 为完成支付、结算、物流、发票或技术服务而向合作方提供必要信息；
* 根据法律法规、司法机关、行政机关要求提供；
* 为处理侵权投诉、版权争议或用户纠纷而提供必要信息；
* 在公司合并、分立、收购、资产转让等情况下依法转移相关信息。

五、信息存储

平台将在实现本政策所述目的所需的期限内保存个人信息。

超出保存期限后，平台将对相关信息进行删除、匿名化或法律法规允许的其他处理。

六、信息安全

平台将采取合理的技术和管理措施保护用户信息安全，包括但不限于：

* 数据加密；
* 访问权限控制；
* 安全审计；
* 日志监控；
* 账号验证；
* 风险预警；
* 数据备份。

但用户理解，互联网环境并非绝对安全，平台无法保证信息传输和存储的绝对安全。

七、用户权利

用户依法享有以下权利：

* 查询个人信息；
* 更正个人信息；
* 删除个人信息；
* 撤回授权；
* 注销账号；
* 获取个人信息副本；
* 投诉或反馈隐私问题。

用户可通过平台客服或隐私联系渠道提出相关请求。`
  },
  {
    type: "service",
    title: "用户服务协议",
    content: `用户服务协议 · v2026.05

一、协议范围

本协议适用于所有访问、注册、登录、浏览、试听、下载、购买、授权、上传或使用平台服务的用户。

用户使用平台服务，即表示已阅读、理解并同意遵守本协议及平台发布的相关规则。

二、服务内容

平台向用户提供以下服务：

* 音乐、音效、语音等音频素材展示；
* 搜索、筛选、试听、收藏；
* 下载、购买、订阅；
* 商业授权；
* 创作者入驻；
* 作品上传与管理；
* 授权记录查询；
* 客服与争议处理；
* 其他与音频素材相关的服务。

三、账号注册

用户应使用真实、准确、合法的信息注册账号。

用户应妥善保管账号和密码，不得将账号转让、出租、出借或共享给他人使用。

因用户账号管理不当导致的损失，由用户自行承担。

四、用户使用规范

用户不得利用平台从事以下行为：

1. 侵犯他人版权、商标权、肖像权、声音权益或其他合法权益；
2. 未经授权复制、传播、转售、转授权平台作品；
3. 批量爬取、抓取、下载或破解平台内容；
4. 绕过平台交易系统私下交易；
5. 上传违法、违规、低俗、恶意或虚假内容；
6. 干扰平台系统安全和正常运营；
7. 冒充他人或虚构身份；
8. 其他违反法律法规或平台规则的行为。

五、素材使用限制

用户购买或下载平台素材后，应按照具体授权类型使用。

除非获得明确授权，用户不得：

* 将素材单独转售；
* 将素材上传至其他素材库平台；
* 将素材用于训练 AI 模型；
* 将素材作为采样包、素材包、数据库再次分发；
* 声称自己拥有素材的完整著作权；
* 将素材用于违法、欺诈、色情、暴力、仇恨或其他不当用途。

六、订单与支付

用户在平台购买、订阅或授权作品时，应按照页面显示价格完成支付。

订单完成后，用户可根据授权范围获得相应使用权。

具体退款、取消、发票和售后规则，以平台页面说明为准。

七、知识产权

平台中的商标、Logo、界面设计、系统功能、分类结构、数据库、推荐算法、平台文案及其他内容，归平台或相关权利人所有。

未经平台书面许可，用户不得复制、修改、传播、反向工程或商业使用平台自身内容。

八、责任限制

平台将尽合理努力保障服务稳定、安全、可用，但不承诺服务不会中断、错误或完全满足用户需求。

因不可抗力、网络故障、第三方服务异常、黑客攻击、政策变化或用户自身原因导致的损失，平台在法律允许范围内不承担责任。

九、协议变更

平台有权根据法律法规、业务调整或运营需要修改本协议。

修改后的协议将在平台公布，用户继续使用平台服务即视为接受更新后的协议。`
  },
  {
    type: "upload_policy",
    title: "内容上传规范",
    content: `内容上传规范 · v2026.05

一、适用范围

本规范适用于所有创作者、用户及合作方在平台上传、发布、提交、展示或销售的内容。

内容包括但不限于：

* 音乐；
* 音效；
* 人声；
* 配音；
* 采样；
* Loop；
* Stem；
* 工程文件；
* 专辑封面；
* 作品标题；
* 描述文案；
* 标签；
* 授权说明；
* AI 使用说明。

二、禁止上传内容

平台禁止上传以下内容：

1. 侵权内容

包括但不限于：

* 未经授权使用他人音乐、音效、录音、采样或人声；
* 盗用他人作品；
* 未经授权改编、翻唱、混音、Remix；
* 未经授权使用影视、游戏、动漫、广告、品牌或 IP 内容；
* 未经授权使用第三方素材包、采样包或音源库内容；
* 侵犯他人肖像权、姓名权、声音权益或商标权的内容。

2. 未授权采样内容

创作者不得上传包含未经授权采样的作品。

如作品使用了采样，创作者应确保：

* 已获得合法授权；
* 授权范围允许商业分发；
* 授权范围允许在素材库平台销售或转授权；
* 可根据平台要求提供授权证明。

3. 违法违规内容

包括但不限于：

* 涉及色情、暴力、恐怖、赌博、毒品、诈骗等内容；
* 煽动仇恨、歧视或暴力；
* 侵犯国家安全、公共秩序或社会公德；
* 传播虚假信息、恶意误导或欺诈内容；
* 法律法规禁止的其他内容。

4. 虚假标注内容

创作者不得进行以下虚假标注：

* 将非原创作品标注为原创；
* 将 AI 生成作品标注为完全人工创作；
* 虚假标注独家授权；
* 虚假标注版权归属；
* 虚构创作人员、演唱者、配音演员或制作团队；
* 虚假填写授权范围、风格标签、用途分类。

5. 恶意上传内容

包括但不限于：

* 批量上传低质量、重复、无意义内容；
* 上传噪音、空白文件、损坏文件；
* 上传误导性标题或封面；
* 通过关键词堆砌获取流量；
* 上传明显不符合平台质量标准的内容。

三、文件质量要求

平台建议上传内容符合以下基本标准：

音乐类

* 格式：WAV / FLAC / MP3；
* 采样率：建议 44.1kHz 或以上；
* 位深：建议 16bit 或 24bit；
* 不应存在明显爆音、失真、断裂、杂音或异常电流声；
* Loop 类素材应确保循环点自然。

音效类

* 文件命名清晰；
* 分类明确；
* 声音主体突出；
* 不应包含明显环境噪声或版权风险来源；
* 多版本音效应有清晰命名区分。

人声与配音类

* 应确认表演者授权；
* 应避免未经授权的声音克隆；
* 应标注语言、情绪、性别、年龄感、用途等信息；
* 不得上传侵犯真实人物声音权益的内容。

四、标题与标签规范

创作者应准确填写作品标题、分类、风格、情绪、BPM、调性、适用场景、授权类型等信息。

不得使用以下方式误导用户：

* 与作品无关的热门关键词；
* 冒用知名音乐人、游戏、影视、品牌名称；
* 暗示未经证实的官方授权；
* 标题党、夸大宣传或虚假描述。

五、审核机制

平台有权对上传内容进行人工或系统审核。

审核内容包括：

* 文件质量；
* 版权风险；
* AI 使用情况；
* 标题与标签准确性；
* 内容合法性；
* 商业授权适用性；
* 是否符合平台调性和分类标准。

平台审核通过不代表对作品权属作出最终法律保证，创作者仍应对上传内容承担全部责任。

六、违规处理

如内容违反本规范，平台有权采取以下措施：

* 驳回上传；
* 要求修改；
* 限制展示；
* 暂停下载；
* 下架作品；
* 冻结收益；
* 限制账号功能；
* 终止合作；
* 向权利人、用户或监管部门提供必要信息。

七、权属证明

平台可要求创作者提供以下证明材料：

* 原始工程文件；
* 分轨文件；
* 创作过程记录；
* 采样授权文件；
* 表演者授权文件；
* 版权登记证明；
* 合同或委托创作协议；
* AI 工具使用记录；
* 其他可证明权属的材料。

创作者未能提供有效证明的，平台有权暂停或下架相关内容。`
  }
];

function main() {
  fs.mkdirSync(dbDir, { recursive: true });
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const albums = catalog.albums || [];
  const tracks = catalog.tracks || [];
  const now = new Date().toISOString();
  const statements = [];

  statements.push("PRAGMA foreign_keys = ON;");
  statements.push("DROP TABLE IF EXISTS ingest_items;");
  statements.push("DROP TABLE IF EXISTS ingest_jobs;");
  statements.push(`
CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  creator_id TEXT,
  title TEXT NOT NULL,
  category TEXT,
  cover_url TEXT,
  source_folder TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  published_at TEXT
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS tracks (
  id TEXT PRIMARY KEY,
  album_id TEXT REFERENCES albums(id),
  creator_id TEXT,
  title TEXT NOT NULL,
  title_en TEXT,
  artist TEXT,
  type TEXT NOT NULL DEFAULT 'music',
  duration INTEGER NOT NULL DEFAULT 0,
  bpm INTEGER NOT NULL DEFAULT 0,
  musical_key TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  popular INTEGER NOT NULL DEFAULT 0,
  match_text TEXT,
  audio_url TEXT,
  image_css TEXT,
  color_css TEXT,
  source_file TEXT,
  source_path TEXT,
  source_format TEXT,
  waveform_source TEXT,
  peaks_json TEXT,
  usage_json TEXT,
  scene_json TEXT,
  style_json TEXT,
  mood_json TEXT,
  structure_json TEXT,
  rights_status TEXT NOT NULL DEFAULT 'cleared',
  status TEXT NOT NULL DEFAULT 'published',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  published_at TEXT
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  file_role TEXT NOT NULL,
  url TEXT,
  local_path TEXT,
  mime_type TEXT,
  created_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  group_name TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS asset_tags (
  asset_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (asset_id, tag_id)
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS ingest_jobs (
  id TEXT PRIMARY KEY,
  creator_id TEXT,
  source_type TEXT NOT NULL,
  source_path TEXT,
  asset_type TEXT NOT NULL,
  status TEXT NOT NULL,
  total_items INTEGER NOT NULL DEFAULT 0,
  success_items INTEGER NOT NULL DEFAULT 0,
  failed_items INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  completed_at TEXT
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS ingest_items (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES ingest_jobs(id),
  asset_id TEXT,
  creator_id TEXT,
  original_filename TEXT NOT NULL,
  stored_path TEXT,
  status TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'uploaded',
  error_message TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  requested_ip TEXT,
  user_agent TEXT
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS creators (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  display_name TEXT NOT NULL,
  bio TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  rights_status TEXT NOT NULL DEFAULT 'cleared',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS agreements (
  id TEXT PRIMARY KEY,
  agreement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  required_for_creator INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS creator_agreement_signatures (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  creator_id TEXT,
  agreement_id TEXT NOT NULL REFERENCES agreements(id),
  agreement_type TEXT NOT NULL,
  version TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  scenario TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  signed_at TEXT NOT NULL,
  UNIQUE(user_id, agreement_id, scenario)
);`);
  statements.push(`
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  payload_json TEXT,
  created_at TEXT NOT NULL
);`);
  statements.push("DELETE FROM asset_tags;");
  statements.push("DELETE FROM tags;");
  statements.push("DELETE FROM files;");
  statements.push("DELETE FROM tracks;");
  statements.push("DELETE FROM albums;");
  statements.push("DELETE FROM ingest_jobs;");

  albums.forEach((album, index) => {
    statements.push(insert("albums", {
      id: sql(album.name),
      creator_id: sql("astrasonic-sleep-lab"),
      title: sql(album.title || album.name),
      category: sql(album.category || "睡眠类场景音乐"),
      cover_url: sql(album.cover),
      source_folder: sql(album.sourceFolder),
      description: sql(`${album.title || album.name} · ASTRASONIC 睡眠类场景音乐专辑`),
      status: sql("published"),
      sort_order: index,
      created_at: sql(now),
      published_at: sql(now)
    }));
  });

  tracks.forEach((track, index) => {
    statements.push(insert("tracks", {
      id: sql(track.id),
      album_id: sql(track.album),
      creator_id: sql("astrasonic-sleep-lab"),
      title: sql(track.title),
      title_en: sql(track.titleEn),
      artist: sql(track.artist),
      type: sql(track.type || "music"),
      duration: sql(track.duration),
      bpm: sql(track.bpm),
      musical_key: sql(track.key),
      price: sql(track.price),
      popular: sql(track.popular),
      match_text: sql(track.match),
      audio_url: sql(track.audio),
      image_css: sql(track.image),
      color_css: sql(track.color),
      source_file: sql(track.sourceFile),
      source_path: sql(track.sourcePath),
      source_format: sql(track.sourceFormat),
      waveform_source: sql(track.waveformSource),
      peaks_json: json(track.peaks || []),
      usage_json: json(track.usage || []),
      scene_json: json(track.scene || []),
      style_json: json(track.style || []),
      mood_json: json(track.mood || []),
      structure_json: json(track.structure || []),
      rights_status: sql("cleared"),
      status: sql("published"),
      sort_order: index,
      created_at: sql(track.ingestedAt || now),
      published_at: sql(track.ingestedAt || now)
    }));
    statements.push(insert("files", {
      id: sql(`${track.id}-source`),
      asset_id: sql(track.id),
      file_role: sql("source_wav"),
      url: "NULL",
      local_path: sql(track.sourcePath),
      mime_type: sql("audio/wav"),
      created_at: sql(now)
    }));
    statements.push(insert("files", {
      id: sql(`${track.id}-preview`),
      asset_id: sql(track.id),
      file_role: sql("preview_mp3"),
      url: sql(track.audio),
      local_path: sql(path.join(rootDir, track.audio.replace(/^\.\//, ""))),
      mime_type: sql("audio/mpeg"),
      created_at: sql(now)
    }));

    const tagGroups = {
      album: [track.album],
      usage: track.usage,
      scene: track.scene,
      style: track.style,
      mood: track.mood,
      structure: track.structure
    };
    Object.entries(tagGroups).forEach(([groupName, tags]) => {
      (tags || []).forEach((label) => {
        const tagId = `${groupName}:${label}`;
        statements.push(`INSERT OR IGNORE INTO tags (id, label, group_name) VALUES (${sql(tagId)}, ${sql(label)}, ${sql(groupName)});`);
        statements.push(`INSERT OR IGNORE INTO asset_tags (asset_id, tag_id) VALUES (${sql(track.id)}, ${sql(tagId)});`);
      });
    });
  });

  statements.push(insert("ingest_jobs", {
    id: sql("seed-astrasonic-sleep-library"),
    creator_id: sql("astrasonic-sleep-lab"),
    source_type: sql("local_catalog_seed"),
    source_path: sql(catalogPath),
    asset_type: sql("music"),
    status: sql("completed"),
    total_items: tracks.length,
    success_items: tracks.length,
    failed_items: 0,
    created_at: sql(now),
    completed_at: sql(now)
  }));

  agreementSeeds.forEach(({ type, title, content }) => {
    const version = "2026.05";
    const hash = require("crypto").createHash("sha256").update(`${type}:${version}:${content}`).digest("hex");
    statements.push(`
      INSERT INTO agreements (id, agreement_type, title, version, content, content_hash, required_for_creator, active, created_at)
      VALUES (${sql(`agr-${type}-${version}`)}, ${sql(type)}, ${sql(title)}, ${sql(version)}, ${sql(content)}, ${sql(hash)}, 1, 1, ${sql(now)})
      ON CONFLICT(id) DO UPDATE SET
        agreement_type = excluded.agreement_type,
        title = excluded.title,
        version = excluded.version,
        content = excluded.content,
        content_hash = excluded.content_hash,
        required_for_creator = excluded.required_for_creator,
        active = excluded.active;
    `);
  });

  execFileSync("sqlite3", [dbPath], { input: `BEGIN;\n${statements.join("\n")}\nCOMMIT;\n` });
  console.log(`Seeded ${albums.length} albums and ${tracks.length} tracks into ${dbPath}`);
}

main();
