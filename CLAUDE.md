# 薪資出勤（老闆用排班＋薪資統計 PWA）

iPhone 用的網頁 App。純靜態網站，沒有建置步驟，部署在 GitHub Pages（推上 main 就自動部署，網址 https://king22killer-dot.github.io/salary/）。改動請先放在開發分支，累積好再一次推上 main。

## 檔案
- `index.html`：整個 App（HTML＋CSS＋JS 都在這個檔）。
- `sw.js`：Service Worker，`CACHE` 名稱要跟著版本號更新（例如 `salary-v3`）。
- `manifest.json`、`icon-*.png`：加入主畫面用。
- `.nojekyll`：讓 GitHub Pages 直接發布檔案（不要刪）。

## 每次修改的規則
1. 改 `index.html` 裡的 `const APP_VER='vN（YYYY-MM-DD）';`，版本號加 1。
2. `sw.js` 的 `CACHE` 改成同一個版本號（`salary-vN`）。
3. 有新功能或操作改變時，更新 `index.html` 裡 `helpCard()` 的使用說明。
4. 用 Playwright（iPhone 13 模擬）開頁面測試，確認沒有 JS 錯誤再 commit。
5. commit 訊息用中文簡述改了什麼。

## 重要的程式區塊（index.html）
- 資料存在 localStorage（key `salaryBoss.v1`，內容 `ver:2`）：`employees`（姓名、日薪 `rate`）、`records['YYYY-MM-DD'][員工id]＝{w:0.5|1, ot:加班次數, add, sub, note}`。沒有接雲端；設定頁可匯出／匯入 JSON 備份。`migrate()` 會把 v1（班別、時薪／月薪）的資料轉成 v2。
- 計薪規則（使用者指定）：不分早中晚班，只記日薪。一天 0.5 工或 1 工；每次加班＝0.5 工（`OT_UNIT`）；1 工＝1 日薪。
- `calc()`：薪資＝（正班工數＋加班次數×0.5）× 日薪＋加給－預支／扣款。
- 畫面：`renderCal()` 班表（按鈕快速記工 `tapDay()`、`dayEditor()` 每日詳細）、`renderStat()` 統計與 CSV 匯出、`renderEmp()` 員工、`renderSet()` 設定與備份。

## 使用者偏好
- 介面與說明一律繁體中文。
- 使用者主要在 iPhone 上使用。
