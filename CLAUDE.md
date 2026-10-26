# 薪資出勤（老闆用排班＋薪資統計 PWA）

iPhone 用的網頁 App。純靜態網站，沒有建置步驟，部署在 GitHub Pages（推上 main 就自動部署，網址 https://king22killer-dot.github.io/salary/）。改動請先放在開發分支，累積好再一次推上 main。

## 檔案
- `index.html`：整個 App（HTML＋CSS＋JS 都在這個檔）。
- `sw.js`：Service Worker，`CACHE` 名稱要跟著版本號更新（例如 `salary-v11`）。
- `manifest.json`、`icon-*.png`：加入主畫面用。
- `.nojekyll`：讓 GitHub Pages 直接發布檔案（不要刪）。

## 每次修改的規則
1. 改 `index.html` 裡的 `const APP_VER='vN（YYYY-MM-DD）';`，版本號加 1。
2. `sw.js` 的 `CACHE` 改成同一個版本號（`salary-vN`）。
3. 有新功能或操作改變時，更新 `index.html` 裡 `helpCard()` 的使用說明。
4. 用 Playwright（iPhone 13 模擬）開頁面測試，確認沒有 JS 錯誤再 commit。
5. commit 訊息用中文簡述改了什麼。

## 重要的程式區塊（index.html）
- 資料存在 localStorage（key `salaryBoss.v1`，內容 `ver:2`）：`employees`（姓名、起薪 `rate`、調薪 `raises:[{from:'YYYY-MM-DD',rate}]`）、`records['YYYY-MM-DD'][員工id]＝{w:0.5|1, ot:加班次數, add, sub, note}`、`settings.cutoff`（結算日，0＝月底）。沒有接雲端；設定頁可匯出／匯入 JSON 備份。`migrate()` 會把 v1（班別、時薪／月薪）的資料轉成 v2。
- 計薪規則（使用者指定）：不分早中晚班，只記日薪。一天 0.5 工或 1 工；每次加班＝0.5 工（`OT_UNIT`）；1 工＝1 日薪。
- 薪資期間：畫面上是「每期從 N 日 到 次月 N−1 日」（`startSelect()`），存成 `settings.cutoff＝N−1`；`period(y,m)` 算出以 m 月結束的那一期（26 日起 → 10 月那期＝9/26～10/25）。統計頁上方標題直接顯示起訖日期；可切「這次自訂」（`S.range`）。
- 調薪：`rateOn(e,日期)` 取當天日薪；`calc(e,from,to)` 逐日累計，日薪不同就分段（`segs`），統計、CSV、薪資單都分段列出。
- 薪資單：`slipText()` 產生文字，`slipSheet()` 可修改後用 `https://line.me/R/share?text=` 開 LINE 選聊天室傳送。
- 畫面：`renderCal()` 班表（按鈕快速記工 `tapDay()`、`dayEditor()` 每日詳細）、`renderStat()` 統計與 CSV 匯出、`renderEmp()`／`editEmp()` 員工與調薪、`renderSet()` 設定（結算日、備份）。
- 工程安排：`DB.projects＝[{id,name,place,color,note,done,from,to,days}]`（連續施工：from～to，to 空白＝未定；指定施工日：`days` 日期陣列，from／to 自動取頭尾），某人某天在哪個工程存在 `records[日期][員工id].p`。班表上方切「📅 記工／🏗️ 工程安排」（`S.calMode`）；`renderJobs()` 按日期派工（`S.jd`，標題 ‹ › 換天）、`assignSheet()` 選人、`copyPrevDay()` 照前一天、`dispatchText()` 派工單用 LINE 傳。只安排不算薪資（`calc()` 只看 w／ot）；統計頁 `jobCostCard()` 列各工程的人次、工數、人工成本。
- 工程標籤：`monthLanes()` 幫當月有施工日的工程分車道（整個月車道數固定，標籤才會對齊），`bandsHtml()` 在每個施工日的日曆格底部畫一顆圓角標籤、寫工程名稱（最多兩行、`MAX_LANES` 條），`monthProjCard()` 是月曆下方的「本月工程」。工程安排只列當天在期間內的工程（`projActive()`）。
- 施工日（使用者說的「跨日」＝隔一天或隔好幾天才去做，不是做到半夜）：`isWorkDay()` 判斷某天是不是施工日；標籤只出現在施工日；`daysText()` 把日期壓成「10/5、10/7、10/12～10/14」；工程編輯有小月曆點選施工日；工程安排畫面可按「📌 這天也要施工」（`addWorkDay()`，連續施工的工程會轉成指定施工日）。
- 確認視窗一律用 App 內的 `ask()`，不要用 `confirm`／`alert`／`prompt`。

## 介面風格（v10，使用者給的參考圖）
- 深藍漸層標題列、淺藍灰底（`--bg`）、白色圓角卡片＋淡陰影；主色 `--navy`／`--blue`，顏色都用 `:root` 的 CSS 變數。
- 記工／工程安排是大顆分段按鈕（`.seg.modebar`），員工是膠囊按鈕（`.chip`），選中＝深藍。
- 月曆格白底細框圓角，今天＝橘框＋米色底；下方分頁列用線條 SVG 圖示，選中＝藍色＋底線。

## 使用者偏好
- 介面與說明一律繁體中文。
- 使用者主要在 iPhone 上使用。
