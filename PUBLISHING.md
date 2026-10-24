# 鍙戝竷璇存槑 / Publishing

## 褰撳墠鍙戝竷鐘舵€?

- GitHub 浠撳簱锛?https://github.com/0avatar0/dsh-ai-book-shelf>
- 棣栦釜 Release锛?https://github.com/0avatar0/dsh-ai-book-shelf/releases/tag/v2.5.2>
- 鍙戝竷鍖咃細
  - `dsh-ai-book-shelf-2.5.2.tgz`锛欴SH 鎻掍欢瀹夎鍖?
  - `dsh-ai-book-shelf-2.5.2.zip`锛氬寘鍚?tgz銆佷腑鏂囧畨瑁呰鏄庡拰 SHA-256
- 褰撳墠鎻掍欢鐗堟湰锛歚2.5.2`
- npm 鍏叡鍖咃細<https://www.npmjs.com/package/dsh-ai-book-shelf>锛坄latest` = 2.5.2锛?

## 涓€銆佸彂甯冨埌 GitHub锛堝凡缁忓畬鎴愶紝鍚庣画鏇存柊鐢級

鍓嶇疆锛氬凡鐧诲綍 GitHub 璐﹀彿 `0avatar0`锛屾湰鏈哄凡閰嶇疆 Git銆?

```bash
cd /d/BookLib/epub-reader-plugin

# 1. 淇敼 package.json 鐨?version锛岀劧鍚庨噸鏂版墦鍖呭惈
cd /d/BookLib/epub-reader-plugin
pnpm pack --pack-destination ../dist

# 2. 鐢熸垚鏍￠獙鍜屽苟鎵撳寘 zip锛堝彲閫夛級
cd ../dist
sha256sum dsh-ai-book-shelf-<version>.tgz > SHA256SUMS.txt

# 3. 鎻愪氦骞舵帹閫佹簮鐮?
cd ../epub-reader-plugin
git add -A
git commit -m "Release <version>"
git push

# 4. 鍒涘缓 GitHub Release锛屽苟涓婁紶瀹夎鍖?
gh release create v<version> \
  ../dist/dsh-ai-book-shelf-<version>.tgz \
  ../dist/dsh-ai-book-shelf-<version>.zip \
  ../dist/INSTALL-zh.md \
  ../dist/SHA256SUMS.txt \
  --title "v<version>" \
  --notes "鏈増鏈洿鏂拌鏄?
```

濡傛灉浠ュ悗鎹㈢數鑴戯紝鍏堝畨瑁?Git 鍜?GitHub CLI锛岀劧鍚庯細

```bash
gh auth login --hostname github.com --git-protocol https --web
```

## 浜屻€佸彂甯冨埌 npm锛堝叕寮€鍖咃紝鍙€夛級

闇€瑕佹敞鍐岋細

1. **npm 璐﹀彿**锛?https://www.npmjs.com/signup>
2. 娉ㄥ唽鍚庨獙璇侀偖绠憋紱寤鸿寮€鍚?2FA銆?
3. 鍦ㄧ粓绔櫥褰曪細

```bash
npm login
npm whoami
```

褰撳墠婧愮爜鍖呭悕鏄?`@local/dsh-epub-reader`锛屼笖 `private: true`锛?*涓嶈兘鐩存帴鍙戝竷**銆備粨搴撻噷鎻愪緵浜嗗彂甯冭剼鏈紝瀹冧細鑷姩鎵撳寘鍒颁复鏃剁洰褰曘€佹敼鍚嶄负鍏紑鍖呭悕骞跺彂甯冿細

```bash
cd /d/BookLib/epub-reader-plugin

# 榛樿鍙戝竷涓?dsh-ai-book-shelf
./scripts/publish-npm.sh

# 鎴栨寚瀹氬寘鍚?
NPM_NAME=your-name-dsh-ai-book-shelf ./scripts/publish-npm.sh
```

npm 鍖呭悕蹇呴』鍏ㄥ眬鍞竴锛涘綋鍓嶆煡璇?`dsh-ai-book-shelf` 鍜?`dsh-epub-reader` 鍧囨湭琚崰鐢ㄣ€傚彂甯冨墠鍙鏌ワ細

```bash
npm view dsh-ai-book-shelf version
```

鍙戝竷鍚庯紝鍏朵粬鐢佃剳鍙湪 DSH 鐨?**Plugins 鈫?Add plugin** 涓～锛?

```text
dsh-ai-book-shelf@2.5.2
```

鎴栫户缁娇鐢?tgz锛?

```text
D:\path\to\dsh-ai-book-shelf-2.5.2.tgz
```

## 涓夈€佹敞鍐屾竻鍗?

| 鐢ㄩ€?| 闇€瑕佹敞鍐?| 璇存槑 |
|---|---|---|
| GitHub 婧愮爜/Release | GitHub 璐﹀彿 | 宸叉湁 `0avatar0` |
| npm 鍏叡瀹夎 | npm 璐﹀彿 | 鍏嶈垂锛涢渶閭楠岃瘉 |
| DSH 鎻掍欢瀹夎 | 涓嶉渶瑕侀澶栨敞鍐?| 鐢?tgz 鎴?npm 鍖呭悕 |
| 绉佹湁鍒嗗彂 | 涓嶉渶瑕?| 鐩存帴鍙?tgz/zip |

## 鍥涖€佸彂甯冨墠妫€鏌?

```bash
cd /d/BookLib/epub-reader-plugin
node --check index.js
node --check client.js
git status
git diff --stat
```

- 涓嶈鎻愪氦 `D:\BookLib\.epub-reader`銆佷功搴撱€佽鏂?PDF銆佺炕璇?JSON 鎴栨敞閲婃暟鎹€?
- `vendor/pdfjs` 宸查殢浠撳簱涓€璧峰垎鍙戯紝瀹夎鏃朵笉闇€瑕侀澶栦笅杞?PDF.js銆?
- 鍙戝竷鍓嶇‘璁?`package.json` 鐨?`version`銆丷EADME銆両NSTALL-zh 涓€鑷淬€?

