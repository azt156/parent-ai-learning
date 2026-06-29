# AI 未來探索平台親子共學示範頁｜下一視窗交接

更新時間：2026-06-30 04:30 CST

## 目前目標

製作一個可部署到 GitHub Pages 的親子共學推廣 / 試用頁，讓家長先理解課程價值，登入後才能看到會員課程內容。

## 產品定位

- 第一推廣對象：家長。
- 核心概念：親子共學，教家長成為孩子的探索引導者。
- 課程主旨：孩子不是找不到夢想，而是還沒有找到一件讓他感興趣的事情，所以不知道自己的夢想在哪裡。
- 第一堂課：如何從興趣找到夢想？親子共學・夢想九宮格。
- 第二推廣對象：大人跨域能力，目前只做概念展示，不提供實際課程功能。

## 網站位置

主資料夾：

```text
/Users/azt156/Documents/MTK/colearn/github-pages/parent-ai-learning/
```

主要檔案：

```text
index.html
README.md
WORK_LOG.md
HANDOFF_NEXT_CHAT.md
assets/
apps-script/Code.gs
```

## 目前功能

- GitHub Pages 單頁靜態網站。
- 外觀接近原本 `/exploration` 的 FEDS 風格。
- 公開頁只顯示課程摘要與推廣內容。
- 會員課程內容登入後才顯示。
- 會員課程包含：
  - 課前夢想影片嵌入。
  - 夢想九宮格。
  - 中央暫定夢想欄位，例如：當醫生、當作家。
  - What / Why / How 引導問題。
  - 三件小行動。
  - 拍照 / 上傳照片預覽。
  - localStorage 保存共學紀錄。
- 成人跨域區塊只展示概念，不開課程功能。

## 登入現況

目前為了先讓使用者可以看到會員課程，已退回簡化登入：

- Gmail / 電子信箱 + 密碼。
- Apps Script 可寫入 Google Sheet。
- 密碼用 salt + SHA-256 雜湊保存，不保存明文。
- 尚未設定 Apps Script 時，可使用前端 Admin 試用帳號。

Admin 試用帳號：

```text
email：admin@demo.local
密碼：admin1234
```

注意：Admin 試用帳號只存在前端程式，適合展示與驗收，不適合正式收費營運。

## Google Sheet / Apps Script

目前只需要兩個設定：

`apps-script/Code.gs`：

```js
const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
```

`index.html`：

```js
var APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

已取消 Google OAuth / Google Client ID，暫時不需要 Google Cloud Console。

## GitHub Pages 上傳內容

上傳 repo 根目錄時放這些：

```text
index.html
README.md
WORK_LOG.md
HANDOFF_NEXT_CHAT.md
assets/
apps-script/
```

不要上傳 `.DS_Store`。

## 最近修正

- 修正 Hero 下方指標卡與按鈕重疊。
- 把真正 Google 帳號登入退回 Gmail + 密碼簡化版。
- 新增 Admin 試用帳號，讓 Apps Script 未設定時也能進入會員課程。
- README 補上 Admin 試用帳號說明。

## 下一步建議

1. 先把 zip 或資料夾內容上傳到 GitHub Pages。
2. 用 Admin 試用帳號檢查會員課程視覺與內容。
3. 若要讓一般使用者註冊，完成 Apps Script + Sheet ID + Web App URL。
4. 正式收費營運前，改成正式後端會員系統或真正 OAuth 登入。
