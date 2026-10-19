# DroidDeck 0.1.0

DroidDeck 是一款基于 Husk 3.0 的 GPL 开源衍生版。它保留 APK 导入、Android
原生翻译层、QEMU 完整模拟、JIT、存档和手柄支持，同时使用独立的
名称、图标、Bundle ID `com.droiddeck.app` 和 URL Scheme `droiddeck://`。

## 当前交付状态

- Windows 端已完成源码定制、品牌隔离、版本统一和静态校验。
- `.github/workflows/build-ipa.yml` 会在 GitHub 的 macOS runner 上从干净环境和固定源码版本构建 Android MVP。
- 成功后会生成 `DroidDeck.ipa`、`DroidDeck.tipa` 和 `SHA256SUMS.txt`。
- 本机是 Windows，不能运行 Xcode，因此这里不能把未经 macOS 编译验证的文件冒充成成品 IPA。

## 生成 IPA

1. 在 GitHub 新建公开仓库并推送本目录。本项目选择把对应提交与 IPA 一起公开，
   以便接收者直接取得 GPL 对应源码。
2. 若发布到名为 `DroidDeck` 的分支，首次推送会自动开始构建；若工作流位于
   默认分支，也可以打开 Actions，选择 `Build DroidDeck IPA` 并点击 `Run workflow`。
3. 首次构建会下载并交叉编译 QEMU、ANGLE、MoltenVK、Rust 配对库等，通常需要数小时。
4. 在该次运行的 Artifacts 中下载 `DroidDeck-0.1.0`。

Actions 会把实际仓库与精确 commit 的 URL 写入 IPA 的“关于”页。本地构建若未设置
`DROIDDECK_SOURCE_URL`，应用会显示“不可公开分发”提示；公开发布前必须设置为对应的公开源码 URL。

仓库不附带 AltStore/SideStore source feed：在 DroidDeck 有自己的公开 Release
URL 和可验证哈希之前，不生成会指向上游二进制或占位地址的安装源。

也可以在安装了当前 Xcode、Homebrew 与 `xcodegen` 的 Mac 上运行：

```sh
brew install autoconf automake bison cmake flex gettext libtool meson ninja pkg-config qemu xcodegen
python3 -m pip install --user pyyaml mako packaging
rustup target add aarch64-apple-ios
python3 scripts/verify_droiddeck.py
DROIDDECK_SOURCE_URL="https://github.com/你的账号/你的仓库/tree/精确提交" \
  ./scripts/ci_build.sh build/DroidDeck.ipa
```

## 安装

`DroidDeck.ipa` 是带必要 entitlement 的 ad-hoc 包，供 SideStore、AltStore
等工具重新签名；`DroidDeck.tipa` 供 TrollStore 使用。普通未修改的 iPhone
不能直接点开安装。运行 Android 或游戏仍需按应用内引导启用 JIT。

## 已知边界

- 不是所有 APK 都能运行；翻译层优先支持带 `arm64-v8a` 本机库的游戏。
- clean build 不内置体积很大的 AOSP Java 运行时与系统字体包；纯 Java、Unity 6、部分 Flutter/SDL
  应用不会显示原生运行入口，应选择完整 Android 模式。
- 32 位 ARM 应用不能在现代 iPhone 上运行。
- 完整 Android 使用 QEMU TCG，速度显著慢于翻译层。
- Google Play 登录、云存档及购买不属于可承诺能力。
- 0.1.0 不打包 PS4 运行时；上游所需的 FEXCore 分支未公开，无法从干净源码重现。
- 0.1.0 不打包上游仅以无来源二进制提供的文件选择器补丁；应用内系统文件选择器改用公开的
  `asCopy` API，Files/Safari 的分享菜单也仍可导入。这样避免把不可审计二进制放进发布 IPA。
- 此类应用依赖调试/JIT entitlement，不以 App Store 上架为交付目标。

## 许可证

必须保留根目录 `LICENSE`、`NOTICE.md`、第三方许可证与完整对应源码。详见
`docs/01-licensing.md`。上游项目：<https://github.com/Leviidev/Husk>。
