# DroidDeck

<img src="src/app/Husk/Resources/droiddeck-icon.png" alt="DroidDeck 图标" width="180">

DroidDeck 0.1.0 是基于 [Husk 3.0](https://github.com/Leviidev/Husk) 的
GPL-2.0-or-later 开源衍生版，面向 iPhone 上的 Android APK 导入、原生翻译层和
QEMU 完整 Android 模式。它使用独立的名称、图标、Bundle ID
`com.droiddeck.app` 与 URL Scheme `droiddeck://`。

当前版本只交付 Android 功能；PS4 运行时因无法从公开源码干净重建而未打包。

## 构建 IPA

Windows 无法运行 Xcode。推送到名为 `DroidDeck` 的 GitHub 分支会自动启动
macOS 构建；工作流位于默认分支时也可在 **Actions → Build DroidDeck IPA →
Run workflow** 手动启动。成功的
`DroidDeck-0.1.0` artifact 包含：

- `DroidDeck.ipa`：供 SideStore、AltStore 等重新签名；
- `DroidDeck.tipa`：供 TrollStore；
- `SHA256SUMS.txt`；
- 源码清单和完整第三方许可证资料。

首次构建会下载并交叉编译固定版本的 QEMU、ANGLE、MoltenVK 与 Rust 配对库，
因此可能需要数小时。构建入口是
[`.github/workflows/build-ipa.yml`](.github/workflows/build-ipa.yml)，本地 Mac 可运行：

```sh
./scripts/ci_build.sh build/DroidDeck.ipa
```

详见 [DROIDDECK.md](DROIDDECK.md)。

## 安装与限制

IPA 不能在普通未修改的 iPhone 上直接点击安装，需要侧载工具重新签名或使用
TrollStore。翻译层和完整 Android 模式都需要按应用内指引启用 JIT。并非所有
APK 都兼容；带 `arm64-v8a` 原生库的游戏最适合翻译层，纯 Java 或不兼容应用应
尝试完整 Android 模式。

## 许可证与来源

DroidDeck 及其组合二进制按 GPL-2.0-or-later 分发。每次公开发布 IPA 时，必须
同时提供对应提交的完整源码并保留 `LICENSE`、`NOTICE.md`、
`SOURCE_MANIFEST.md` 与生成的第三方 notices。DroidDeck 与上游 Husk 维护者没有
隶属或背书关系。
