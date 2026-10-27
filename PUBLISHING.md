# 发布说明 / Publishing

## 当前发布状态

- GitHub 仓库：<https://github.com/0avatar0/dsh-ai-book-shelf>
- 首个 Release：<https://github.com/0avatar0/dsh-ai-book-shelf/releases/tag/v2.6.19>
- 发布包：
  - `dsh-ai-book-shelf-2.6.19.tgz`：DSH 插件安装包
  - `dsh-ai-book-shelf-2.6.19.zip`：包含 tgz、中文安装说明和 SHA-256
- 当前插件版本：`2.6.19`
- npm 公共包：<https://www.npmjs.com/package/dsh-ai-book-shelf>（`latest` = 2.6.19）

## 一、发布到 GitHub（已经完成，后续更新用）

前置：已登录 GitHub 账号 `0avatar0`，本机已配置 Git。

```bash
cd /d/BookLib/epub-reader-plugin

# 1. 修改 package.json 的 version，然后重新打包含
cd /d/BookLib/epub-reader-plugin
pnpm pack --pack-destination ../dist

# 2. 生成校验和并打包 zip（可选）
cd ../dist
sha256sum dsh-ai-book-shelf-<version>.tgz > SHA256SUMS.txt

# 3. 提交并推送源码
cd ../epub-reader-plugin
git add -A
git commit -m "Release <version>"
git push

# 4. 创建 GitHub Release，并上传安装包
gh release create v<version> \
  ../dist/dsh-ai-book-shelf-<version>.tgz \
  ../dist/dsh-ai-book-shelf-<version>.zip \
  ../dist/INSTALL-zh.md \
  ../dist/SHA256SUMS.txt \
  --title "v<version>" \
  --notes "本版本更新说明"
```

如果以后换电脑，先安装 Git 和 GitHub CLI，然后：

```bash
gh auth login --hostname github.com --git-protocol https --web
```

## 二、发布到 npm（公开包，可选）

需要注册：

1. **npm 账号**：<https://www.npmjs.com/signup>
2. 注册后验证邮箱；建议开启 2FA。
3. 在终端登录：

```bash
npm login
npm whoami
```

当前源码包名是 `@local/dsh-epub-reader`，且 `private: true`，**不能直接发布**。仓库里提供了发布脚本，它会自动打包到临时目录、改名为公开包名并发布：

```bash
cd /d/BookLib/epub-reader-plugin

# 默认发布为 dsh-ai-book-shelf
./scripts/publish-npm.sh

# 或指定包名
NPM_NAME=your-name-dsh-ai-book-shelf ./scripts/publish-npm.sh
```

npm 包名必须全局唯一；当前查询 `dsh-ai-book-shelf` 和 `dsh-epub-reader` 均未被占用。发布前可检查：

```bash
npm view dsh-ai-book-shelf version
```

发布后，其他电脑可在 DSH 的 **Plugins → Add plugin** 中填：

```text
dsh-ai-book-shelf@2.6.19
```

或继续使用 tgz：

```text
D:\path\to\dsh-ai-book-shelf-2.6.19.tgz
```

## 三、注册清单

| 用途 | 需要注册 | 说明 |
|---|---|---|
| GitHub 源码/Release | GitHub 账号 | 已有 `0avatar0` |
| npm 公共安装 | npm 账号 | 免费；需邮箱验证 |
| DSH 插件安装 | 不需要额外注册 | 用 tgz 或 npm 包名 |
| 私有分发 | 不需要 | 直接发 tgz/zip |

## 四、发布前检查

```bash
cd /d/BookLib/epub-reader-plugin
node --check index.js
node --check client.js
git status
git diff --stat
```

- 不要提交 `D:\BookLib\.epub-reader`、书库、论文 PDF、翻译 JSON 或注释数据。
- `vendor/pdfjs` 已随仓库一起分发，安装时不需要额外下载 PDF.js。
- 发布前确认 `package.json` 的 `version`、README、INSTALL-zh 一致。
