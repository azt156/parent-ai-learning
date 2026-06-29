# AI 未來探索平台｜親子共學推廣頁

這是一個 GitHub Pages 靜態示範頁，主軸是「家長成為孩子的探索引導者」。

## 檔案

- `index.html`：靜態推廣頁主檔。
- `assets/`：頁面使用的 AI 虛擬照片資產。
- `WORK_LOG.md`：本次製作工作日誌。

## 使用方式

直接開啟 `index.html` 即可瀏覽。

若發布到 GitHub Pages，可將此資料夾作為 Pages 根目錄，或把內容複製到 GitHub Pages repo 的根目錄。

## 內容分層

頁面目前分成兩層：

- 公開頁：只呈現課程定位、家長引導價值、成人跨域概念，以及第一堂課的 Course Design 摘要。
- 登入後會員區：才顯示夢想九宮格實作、課程步驟、What / Why / How 提問、三件小行動、拍照上傳與本機保存。
- 會員課程開始前會嵌入一段 YouTube 夢想影片，讓家長先帶孩子共看，再進入九宮格活動。
- 第二推廣對象與登入註冊維持在公開頁層級，不包在會員課程內。
- 公開推廣頁與會員課程分成上下兩個視圖層級；登入後會切到會員課程頁，不再把課程內容接在首頁下方。
- 會員課程內新增進階 81 格目標計畫表，但預設收合；必須先完成初階 9 格、點選最重要的一格、填完 What / Why / How、寫完三件小行動並保存，才能點「解鎖進階 81 格挑戰」展開。
- 三件小行動與拍照保存屬於基礎課程，會排在「解鎖進階 81 格挑戰」之前。
- 81 格進階課程加入鈴木一朗與楊勇緯的目標拆解案例說明，協助家長帶孩子理解如何從夢想拆到練習。
- 會員課程新增「AI 共學助教」，在 9 格與 81 格之間協助家長產生提問、整理孩子線索、拆下一步行動。

公開課程設計只保留：

> Course Design
>
> 如何從興趣找到夢想？親子共學・夢想九宮格
>
> 課程時長約 60 分鐘。核心不是逼孩子說出夢想，而是陪孩子找出「我好像有興趣」的線索。AI 是選用輔助，主角永遠是孩子自己的想法。

提醒：這是 GitHub Pages 靜態版，所以前端鎖課程適合示範銷售流程；若要正式收費與完整防護，應改用正式後端會員權限。

## Gmail / 電子信箱登入 + Google Sheet 資料庫

本頁的登入採用：

- GitHub Pages 前端
- Google Apps Script Web App
- Google Sheet 作為簡易資料庫

### 建立方式

1. 在 Google Drive 建立一份新的 Google Sheet。
2. 複製網址中的 Sheet ID。
   - 例如：`https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
3. 到 `script.google.com/create` 建立 Apps Script 專案。
4. 將 `apps-script/Code.gs` 的內容貼到 Apps Script。
5. 將 `SPREADSHEET_ID` 改成你的 Sheet ID。
6. 點選 `Deploy` > `New deployment`。
7. 類型選 `Web app`。
8. `Execute as` 選 `Me`。
9. `Who has access` 選 `Anyone`。
10. 部署後複製 Web App URL。
11. 回到 `index.html`，把：

```js
var APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

改成你的 Web App URL。

### Admin 試用帳號

如果 Apps Script 還沒有設定好，也可以先用本機試用帳號進入會員課程：

- email：`admin@demo.local`
- 密碼：`admin1234`

這組帳號只存在前端程式裡，用來快速查看課程內容，不會寫入 Google Sheet，也不適合正式收費營運。

### 發布給合夥人試用

1. 先完成 Google Sheet 與 Apps Script 部署。
2. 將 Apps Script Web App URL 填入 `index.html` 的 `APPS_SCRIPT_URL`。
3. 建立一個 GitHub repo。
4. 把 `github-pages/parent-ai-learning/` 裡的內容放到 repo 根目錄。
5. 到 GitHub repo 的 `Settings` > `Pages`。
6. `Build and deployment` 選 `Deploy from a branch`。
7. Branch 選 `main`，資料夾選 `/root`。
8. 儲存後等待 GitHub Pages 產生網址。
9. 用無痕視窗測試註冊、登入、登入後會員課程是否出現。

### Google Sheet 欄位

Apps Script 會自動建立：

- `users`
- `login_logs`

`users` 欄位包含：

- `user_id`
- `created_at`
- `name`
- `email`
- `password_salt`
- `password_hash`
- `status`
- `note`
- `admin_tag`

前台不詢問身份。後台可用 `note` 或 `admin_tag` 自行註記身份、來源或課程狀態。

### 密碼保存

- 前端會把使用者輸入的密碼送到 Apps Script。
- Apps Script 會用 salt + SHA-256 產生雜湊。
- Google Sheet 不保存明文密碼。
- 這是輕量展示架構，不等同完整資安等級的正式會員系統。

正式大量使用時，建議升級 Firebase Auth、Supabase Auth 或自架後端。

## 線上實作功能

原本課程需要紙、彩色筆與拍照保存，現在已轉成網頁功能：

- 可直接填寫夢想九宮格。
- 可在會員課程內先觀看夢想主題影片。
- 可填寫 What / Why / How 聚斂提問。
- 可建立三件本週可以做的小行動。
- 三件小行動欄位會顯示範例，例如「每天畫一張 10 分鐘小圖」、「週末看一個插畫教學影片」。
- 可勾選行動完成狀態。
- 支援手機拍照或上傳照片，主要用來保存紙本九宮格、白板討論、便利貼或實作成果；上傳後會保存到本次共學紀錄，旁邊也有「保存照片與共學紀錄」按鈕。
- 登入後完成初階 9 格、點選最重要的一格、填完 What / Why / How、寫完三件小行動並保存後，才可點「解鎖進階 81 格挑戰」，展開 81 格目標計畫表，把 9 格興趣線索延伸成能力、練習、資源、行動與作品證明。
- 進階區提供鈴木一朗、楊勇緯案例參考與家長提問腳本。
- 可使用 AI 共學助教產生陪談建議。Demo 版先用前端規則模擬，正式版可改接真正 AI API。
- 登入後頁面上方會顯示「已登入」與「登出」，方便回到公開頁狀態測試。
- 可保存共學紀錄到瀏覽器 `localStorage`。
- 可載入範例或清空紀錄。

提醒：課程填寫內容與照片目前會以 base64 形式保存在使用者自己的瀏覽器中，適合示範與短期體驗。正式長期保存建議接雲端儲存。

## 課程主軸

- 第一推廣對象：家長。
- 核心概念：親子共學，教家長如何像老師一樣提問、等待、陪伴與引導。
- 第一堂課：如何從興趣找到夢想？親子共學・夢想九宮格。
- 核心宗旨：孩子不是找不到夢想，而是還沒有找到一件讓他感興趣的事情，所以不知道自己的夢想在哪裡。
- 第二推廣對象：大人。
- 成人區塊目前只作為跨域能力概念展示，暫不提供實際課程與功能。
