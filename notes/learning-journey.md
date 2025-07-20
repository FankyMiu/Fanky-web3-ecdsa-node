# ECDSA Web App 學習歷程與專案自我筆記 Draft

## 1. 階段性步驟紀錄（Phase-by-Phase Records）

### 🚩 初始化與本地開發環境建置
- 完成 Node.js、npm、VSCode 基本安裝與設定
- 透過 `git clone` 下載專案至本地、明確管理目錄結構
- 分別於 `client`、`server` 資料夾執行 `npm install`，確保依賴完成
- 熟悉 Terminal 路徑、VSCode 基本操作

### 🚩 Phase 1：基本錢包功能與 server-client 溝通
- 能在前端查詢預設帳戶餘額（預設：0x1、0x2、0x3）
- 執行第一次資金流動測試，理解前端頁面與後端 server 回應
- 初次體認到「server 重啟」才能更新帳戶設定與金鑰資料

### 🚩 Phase 2：自製 ECDSA 公私鑰錢包，設定真實帳戶
- 以 Node REPL/自訂 JS 腳本產生三組公私鑰
- 公鑰（130字元、04開頭）正確複製入 server/index.js 的 balances key
- 學會私鑰保管與記錄於本地 wallets.txt，不公開、不 commit
- 體驗前端輸入正確公鑰可查餘額、私鑰配對才能動用此帳戶資金的驗證邏輯

### 🚩 Phase 3：數位簽章驗證轉帳（ECDSA signature workflow）
- 客戶端以私鑰對轉帳訊息本地做簽章，僅傳送（訊息、簽章）給 server
- 後端 server 以 secp256k1 檢查簽章真偽，僅驗證成功才放行扣帳資金
- 深刻認識私鑰/簽章各自不可外流與數位簽章的帳戶控制本質
- 測試錯誤簽章/錯誤私鑰提交時 server 如何準確拒絕

### 🚩 進階安全：防重放攻擊（Replay Attack）設計思考
- 體會若簽章未綁定 nonce/timestamp，惡意第三方可重播舊交易
- 規劃於簽章訊息中加入唯一元素（如流水號、當前時間）以防止複用
- 記錄自己嘗試加入 nonce 欄位於訊息格式，以及 server 驗證防護機制的步驟

## 2. 常見 Bug 記錄與 Debug 經驗

- balances 物件 key 貼公鑰時有誤換行或少引號，導致 server 報 SyntaxError
- client 測試錢包輸入公鑰多/少一字元時查無餘額，反省比對字串時精度要極高
- server 未重啟未讀新設帳號，學會每次更動帳戶設定都要重新 `Ctrl+C` → `node index`
- copy/paste 錯誤習慣導致前後多空白，養成用 VSCode soft wrap 方式橫向檢查

## 3. 最佳實踐（Best Practices）

- 私鑰嚴格本機保存，從不納入 git 專案檔案追蹤
- 每組金鑰都建立 wallets.txt 備份；日後測試新需求也能即時產出所需帳戶
- 資料夾命名與讀寫區分分明，`ecdsa-node` 下另開 wallets 子資料夾，良好組織專案
- 每階段完成皆同步筆記，易於日後自查與 Demo 展示

## 4. ECDSA 簽章與驗證流程小抄

| 流程        | 端點   | 技術重點                |
|-------------|--------|------------------------|
| 產生私鑰    | client | secp.utils.randomPrivateKey() |
| 產生公鑰    | client | secp.getPublicKey(privateKey) |
| 構建訊息    | client | 將 sender, recipient, amount, nonce 等組合字串化 |
| 訊息哈希    | client | hashMessage(message)   |
| 私鑰簽名    | client | secp.sign(hash, privateKey) |
| 發送至後端  | client → server | POST body: { message, signature } |
| 後端驗證    | server | secp.recoverPublicKey(hash, signature, recoveryBit) 對照 sender |
| 結果通知    | server | 成功放行或報錯        |

## 5. 自我反思／學習心得 Draft

- 「只有本人能用私鑰控制資金」是區塊鏈精神，手動導入流程才能體會去中心化信任根本
- 每一步卡關、debug 都是成長契機，學習記錄比結果更重要
- 安全設計不能只考慮 happy flow，惡意攻擊場景／異常測試等同主功能必練
- 實戰過程養成嚴謹操作與清晰紀錄，日後不只方便教學，也方便專業呈現

## 6. 建議筆記儲存架構（可放於 Note/md 檔案）

```
ecdsa-node/
  ├─ server/
  ├─ client/
  ├─ wallets/
  │    └─ ecdsa-wallets.txt
  ├─ readme.md      ← 專案簡介、主功能
  └─ notes/
       ├─ learning-journey.md
       ├─ bug-records.md
       └─ signature-workflow.md
```
- `learning-journey.md`：學習大事記與階段小結
- `bug-records.md`：錯誤與 debug 註記
- `signature-workflow.md`：簽章驗證流程與案例
