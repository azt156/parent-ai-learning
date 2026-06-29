# 工作日誌

## 2026-06-29

### 本次目標

建立一個可發布到 GitHub Pages 的靜態推廣頁，根據使用者提供的「親子共學・夢想九宮格」課程設計，重新界定推廣對象。

### 已完成

- 建立 `github-pages/parent-ai-learning/` 靜態網站資料夾。
- 建立 `index.html` 作為 GitHub Pages 首頁。
- 使用現有 FEDS 視覺方向：暖白背景、森林綠主色、AI 紫 accent、柔和卡片、大留白與教育情境照片。
- 將第一推廣對象改為家長，主軸是「家長成為孩子的探索引導者」。
- 將課程設計整理成「如何找到自己的夢想？親子共學・夢想九宮格」推廣內容。
- 補入課程流程：暖身、擴散聯想、聚斂聯想、三件小行動、貼起來動起來。
- 補入第二推廣對象：大人跨域能力概念展示。
- 實作 GitHub Pages 可用的前端登入 / 註冊功能，資料儲存在瀏覽器 `localStorage`。
- 將紙本夢想九宮格轉成可在網頁中填寫的互動九宮格。
- 新增 What / Why / How 聚斂提問欄位。
- 新增三件小行動清單與完成勾選。
- 新增拍照 / 上傳照片功能，支援照片預覽與本機保存。
- 新增保存本次共學紀錄、載入範例與清空功能。
- 複製既有 AI 虛擬照片到 `assets/`，避免外部圖片依賴。
- 建立 `README.md` 說明發布方式與登入註冊限制。
- 將課程主旨調整為「孩子不是找不到夢想，而是還沒有找到一件讓他感興趣的事情」。
- 將註冊登入改成 Google Sheet 資料庫架構。
- 新增 `apps-script/Code.gs`，提供 Google Apps Script 註冊與登入 API。
- 移除前台身份欄位，註冊只保留姓名、Gmail / 電子信箱、密碼。
- Apps Script 會將密碼加鹽雜湊後保存到 Google Sheet，不保存明文密碼。
- 將 GitHub Pages 頁面外殼調整得更接近原本 `/exploration`：新增左上角 hamburger、隱藏式 drawer、Header pills、手機底部導覽與浮動 AI 按鈕。
- 將課程內容改為「公開摘要 + 登入後會員課程」分層。
- 公開頁只保留 Course Design 摘要，不再直接顯示可操作課程工具。
- 新增會員課程鎖定提示，引導使用者註冊或登入後進入實作。
- 登入 / 註冊成功後自動開啟會員課程區。
- 將夢想九宮格中央格改成可填寫的暫定夢想，例如：當醫生、當作家、做遊戲。
- 將完整課程流程、夢想九宮格、What / Why / How、行動清單與拍照上傳移到登入後才顯示。
- 在登入後會員課程起點嵌入夢想主題 YouTube 影片，讓家長先帶孩子共看，再進入九宮格活動。
- 將登入機制從「Gmail / 電子信箱 + 密碼」改為真正的 Google 帳號登入。
- 前端新增 Google Identity Services 登入按鈕，不再要求家長輸入密碼。
- Apps Script 改為接收 Google ID token，驗證後寫入 Google Sheet。
- Google Sheet 會員欄位新增 Google 帳號識別碼、頭像、登入來源與最後登入時間。
- README 補上 Google OAuth Client ID 設定流程。
- README 新增 GitHub Pages 發布與合夥人試用流程。
- 修正首頁 Hero 下方指標卡與按鈕重疊問題，取消過度上移的卡片布局。
- 將 Google Sheet 文案改為「寫入 `Code.gs` 的 `SPREADSHEET_ID` 指定試算表」，避免誤解為家長自己的 Sheet。
- 依使用者決策，將登入機制從真正 Google 帳號登入退回「Gmail / 電子信箱 + 密碼」簡化版。
- 移除 Google Identity Services script、Google 登入按鈕與 `GOOGLE_CLIENT_ID` 設定。
- Apps Script 退回 `register` / `login` API，只需填入 `SPREADSHEET_ID`。
- README 改回只需 Google Sheet ID 與 Apps Script Web App URL 的部署流程。

### 未完成 / 待確認

- Google Sheet + Apps Script 是輕量展示架構，不等同正式會員系統。
- 拍照上傳的照片目前保存在瀏覽器 `localStorage`，適合示範，不適合大量或長期保存。
- 正式上線若需要信箱驗證、忘記密碼、權限控管或大量資料保存，需要接 Firebase、Supabase 或自架後端。
- 成人跨域區塊目前只做概念展示，尚未提供實際課程與功能。
- GitHub Pages 靜態版的前端鎖課程適合示範與早期試用；若要正式收費營運，仍需要正式後端會員權限。
- 會員課程影片使用 YouTube 嵌入，合夥人試用環境需能正常連到 YouTube。
- 目前簡化版不是真正 Google 帳號登入；家長需輸入 email 與自設密碼。

### 下一步建議

- 用瀏覽器實際打開 `index.html` 檢查視覺與文案。
- 決定 GitHub Pages repo 結構：直接使用此資料夾，或複製內容到 Pages repo 根目錄。
- 若要正式收集名單，可新增外部表單服務或串接 Firebase / Supabase。
